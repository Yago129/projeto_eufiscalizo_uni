# eu-fiscalizo-backend/fiscalizacao/views.py
from rest_framework import viewsets
from .models import OrgaoFiscalizado, Fiscalizacao
from .serializers import OrgaoFiscalizadoSerializer, FiscalizacaoSerializer

class OrgaoFiscalizadoViewSet(viewsets.ModelViewSet):
    queryset = OrgaoFiscalizado.objects.all().order_by('nome')
    serializer_class = OrgaoFiscalizadoSerializer

class FiscalizacaoViewSet(viewsets.ModelViewSet):
    queryset = Fiscalizacao.objects.all().order_by('-data_fiscalizacao')
    serializer_class = FiscalizacaoSerializer