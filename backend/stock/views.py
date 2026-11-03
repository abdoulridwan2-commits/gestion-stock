from datetime import timedelta

from django.db import transaction
from django.db.models import Count, Sum
from django.utils import timezone
from rest_framework import mixins, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Mouvement, Produit
from .serializers import MouvementSerializer, ProduitSerializer


class ProduitViewSet(viewsets.ModelViewSet):
    queryset = Produit.objects.all().order_by("nom")
    serializer_class = ProduitSerializer


class MouvementViewSet(
    mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    queryset = Mouvement.objects.select_related("produit").order_by("-date")
    serializer_class = MouvementSerializer

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
    produits = Produit.objects.all()

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
        mouvements = Mouvement.objects.filter(date__date=jour)
        semaine.append(
            {
                "jour": jour.isoformat(),
                "entrees": mouvements.filter(type=Mouvement.ENTREE).aggregate(t=Sum("quantite"))["t"] or 0,
                "sorties": mouvements.filter(type=Mouvement.SORTIE).aggregate(t=Sum("quantite"))["t"] or 0,
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