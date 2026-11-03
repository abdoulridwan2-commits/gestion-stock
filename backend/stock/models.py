from django.db import models


class Produit(models.Model):
    nom = models.CharField(max_length=100)
    categorie = models.CharField(max_length=50, blank=True)
    prix = models.DecimalField(max_digits=10, decimal_places=0)
    quantite = models.PositiveIntegerField(default=0)
    seuil_alerte = models.PositiveIntegerField(default=5)
    cree_le = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nom


class Mouvement(models.Model):
    ENTREE = "entree"
    SORTIE = "sortie"
    TYPES = [(ENTREE, "Entrée"), (SORTIE, "Sortie")]

    produit = models.ForeignKey(Produit, on_delete=models.CASCADE, related_name="mouvements")
    type = models.CharField(max_length=6, choices=TYPES)
    quantite = models.PositiveIntegerField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_type_display()} de {self.quantite} - {self.produit.nom}"