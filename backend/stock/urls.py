from rest_framework.routers import DefaultRouter
from .views import ProduitViewSet, MouvementViewSet

router = DefaultRouter()
router.register("produits", ProduitViewSet)
router.register("mouvements", MouvementViewSet)

urlpatterns = router.urls