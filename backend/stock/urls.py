from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter

from .views import MouvementViewSet, ProduitViewSet, inscription, tableau_de_bord

router = DefaultRouter()
router.register("produits", ProduitViewSet, basename="produit")
router.register("mouvements", MouvementViewSet, basename="mouvement")

urlpatterns = [
    path("tableau-de-bord/", tableau_de_bord),
    path("inscription/", inscription),
    path("connexion/", obtain_auth_token),  # fournie par Django REST Framework
] + router.urls