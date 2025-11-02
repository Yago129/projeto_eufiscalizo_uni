# eu-fiscalizo-backend/fiscalizacao/admin.py
from django.contrib import admin
from .models import OrgaoFiscalizado, Fiscalizacao

# Registra o modelo OrgaoFiscalizado
@admin.register(OrgaoFiscalizado)
class OrgaoFiscalizadoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'cnpj', 'endereco')
    search_fields = ('nome', 'cnpj')

# Registra o modelo Fiscalizacao
@admin.register(Fiscalizacao)
class FiscalizacaoAdmin(admin.ModelAdmin):
    # Campos exibidos na lista principal do Admin
    list_display = ('titulo', 'orgao', 'fiscalizador', 'status', 'data_fiscalizacao')
    # Filtros laterais para facilitar a busca
    list_filter = ('status', 'data_fiscalizacao', 'orgao')
    # Campos para pesquisa
    search_fields = ('titulo', 'descricao', 'orgao__nome')
    # Campos que aparecem apenas para leitura
    readonly_fields = ('data_fiscalizacao',)

# Se você quiser apenas o registro básico, pode usar:
# admin.site.register(OrgaoFiscalizado)
# admin.site.register(Fiscalizacao)