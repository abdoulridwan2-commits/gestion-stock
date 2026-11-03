from django.db import transaction
from rest_framework import viewsets, mixins
from .models import Produit, Mouvement
from .serializers import ProduitSerializer, MouvementSerializer


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