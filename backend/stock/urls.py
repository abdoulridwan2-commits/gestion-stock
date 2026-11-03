from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import MouvementViewSet, ProduitViewSet, tableau_de_bord

router = DefaultRouter()
router.register("produits", ProduitViewSet)
router.register("mouvements", MouvementViewSet)

urlpatterns = [path("tableau-de-bord/", tableau_de_bord)] + router.urls