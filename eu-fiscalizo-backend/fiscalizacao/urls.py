# eu-fiscalizo-backend/fiscalizacao/urls.py
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
# Mapeia /api/orgaos/
router.register(r'orgaos', views.OrgaoFiscalizadoViewSet)
# Mapeia /api/fiscalizacoes/
router.register(r'fiscalizacoes', views.FiscalizacaoViewSet)

urlpatterns = router.urls