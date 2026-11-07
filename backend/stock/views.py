from datetime import timedelta

from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as ErreurDjango
from django.db import transaction
from django.db.models import Count, Sum
from django.utils import timezone
from rest_framework import mixins, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Mouvement, Produit
from .serializers import MouvementSerializer, ProduitSerializer


class ProduitViewSet(viewsets.ModelViewSet):
    serializer_class = ProduitSerializer

    # Chaque commerçant ne voit que ses propres produits
    def get_queryset(self):
        return Produit.objects.filter(proprietaire=self.request.user).order_by("nom")

    # À la création, le produit est rattaché au commerçant connecté
    def perform_create(self, serializer):
        serializer.save(proprietaire=self.request.user)


class MouvementViewSet(
    mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    serializer_class = MouvementSerializer

    def get_queryset(self):
        return (
            Mouvement.objects.filter(produit__proprietaire=self.request.user)
            .select_related("produit")
            .order_by("-date")
        )

    @transaction.atomic
    def perform_create(self, serializer):
        mouvement = serializer.save()
        produit = mouvement.produit
        if mouvement.type == Mouvement.ENTREE:
            produit.quantite += mouvement.quantite
        else:
            produit.quantite -= mouvement.quantite
        produit.save()


@api_view(["GET"])
def tableau_de_bord(request):
    produits = Produit.objects.filter(proprietaire=request.user)
    mouvements_utilisateur = Mouvement.objects.filter(produit__proprietaire=request.user)

    valeur_stock = sum(p.prix * p.quantite for p in produits)
    ruptures = produits.filter(quantite=0).count()
    stock_bas = [p for p in produits if 0 < p.quantite <= p.seuil_alerte]

    a_reapprovisionner = [
        {
            "id": p.id,
            "nom": p.nom,
            "quantite": p.quantite,
            "seuil_alerte": p.seuil_alerte,
            "statut": "rupture" if p.quantite == 0 else "stock_bas",
        }
        for p in produits.order_by("quantite")
        if p.quantite <= p.seuil_alerte
    ][:5]

    aujourdhui = timezone.localdate()
    semaine = []
    for i in range(6, -1, -1):
        jour = aujourdhui - timedelta(days=i)
        du_jour = mouvements_utilisateur.filter(date__date=jour)
        semaine.append(
            {
                "jour": jour.isoformat(),
                "entrees": du_jour.filter(type=Mouvement.ENTREE).aggregate(t=Sum("quantite"))["t"] or 0,
                "sorties": du_jour.filter(type=Mouvement.SORTIE).aggregate(t=Sum("quantite"))["t"] or 0,
            }
        )

    categories = [
        {"categorie": c["categorie"] or "Sans catégorie", "nombre": c["nombre"]}
        for c in produits.values("categorie").annotate(nombre=Count("id"))
    ]

    return Response(
        {
            "valeur_stock": valeur_stock,
            "nombre_produits": produits.count(),
            "stock_bas": len(stock_bas),
            "ruptures": ruptures,
            "a_reapprovisionner": a_reapprovisionner,
            "mouvements_semaine": semaine,
            "categories": categories,
        }
    )


# Inscription : ouverte à tout le monde (AllowAny), sinon personne ne pourrait créer de compte
@api_view(["POST"])
@permission_classes([AllowAny])
def inscription(request):
    nom = request.data.get("username", "").strip()
    mot_de_passe = request.data.get("password", "")

    if not nom or not mot_de_passe:
        return Response({"detail": "Nom d'utilisateur et mot de passe obligatoires."}, status=400)
    if User.objects.filter(username=nom).exists():
        return Response({"detail": "Ce nom d'utilisateur existe déjà."}, status=400)
    try:
        validate_password(mot_de_passe)  # règles de sécurité de Django
    except ErreurDjango as erreur:
        return Response({"detail": " ".join(erreur.messages)}, status=400)

    utilisateur = User.objects.create_user(username=nom, password=mot_de_passe)
    jeton, _ = Token.objects.get_or_create(user=utilisateur)
    return Response({"token": jeton.key, "username": utilisateur.username}, status=201)