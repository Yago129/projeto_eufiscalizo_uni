# eu-fiscalizo-backend/core/urls.py
from django.contrib import admin
from django.urls import path, include # Importe 'include'
from rest_framework_simplejwt.views import ( # NOVAS IMPORTAÇÕES
    TokenObtainPairView,
    TokenRefreshView,
)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('fiscalizacao.urls')),

    # NOVAS ROTAS DE AUTENTICAÇÃO JWT
    # 1. Login (Obtém um novo Access e Refresh Token)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # 2. Refresh (Obtém um novo Access Token usando o Refresh Token)
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]