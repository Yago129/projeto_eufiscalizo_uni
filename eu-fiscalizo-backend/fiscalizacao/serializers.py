# eu-fiscalizo-backend/fiscalizacao/serializers.py
from rest_framework import serializers
from .models import OrgaoFiscalizado, Fiscalizacao

class OrgaoFiscalizadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrgaoFiscalizado
        fields = '__all__'  # Inclui todos os campos do modelo

class FiscalizacaoSerializer(serializers.ModelSerializer):
    # Exibe o nome do fiscalizador e do órgão em vez dos IDs (opcional, mas útil)
    fiscalizador_username = serializers.ReadOnlyField(source='fiscalizador.username')
    orgao_nome = serializers.ReadOnlyField(source='orgao.nome')

    class Meta:
        model = Fiscalizacao
        fields = [
            'id',
            'fiscalizador', # Permite enviar o ID do usuário
            'fiscalizador_username', # Apenas leitura
            'orgao', # Permite enviar o ID do órgão
            'orgao_nome', # Apenas leitura
            'titulo',
            'descricao',
            'status',
            'data_fiscalizacao',
        ]
        read_only_fields = ('data_fiscalizacao',)