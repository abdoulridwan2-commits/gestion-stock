from rest_framework import serializers
from .models import Produit, Mouvement


class ProduitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produit
        fields = "__all__"


class MouvementSerializer(serializers.ModelSerializer):
    produit_nom = serializers.CharField(source="produit.nom", read_only=True)

    class Meta:
        model = Mouvement
        fields = ["id", "produit", "produit_nom", "type", "quantite", "date"]

    def validate(self, data):
        if data["quantite"] <= 0:
            raise serializers.ValidationError("La quantité doit être supérieure à 0.")
        if data["type"] == Mouvement.SORTIE and data["quantite"] > data["produit"].quantite:
            raise serializers.ValidationError("Stock insuffisant pour cette sortie.")
        return data