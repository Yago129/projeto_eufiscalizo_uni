# eu-fiscalizo-backend/fiscalizacao/models.py
from django.db import models
from django.contrib.auth.models import User # Usaremos o modelo de Usuário padrão do Django

# 1. Dados do usuário que está fiscalizando
# Usaremos o modelo 'User' padrão do Django para autenticação e login.
# Se precisar adicionar informações extras, você criaria um modelo 'Perfil'
# com uma chave estrangeira para o User, mas por enquanto, o User é suficiente.

# 2. Detalhes de um determinado órgão fiscalizado
class OrgaoFiscalizado(models.Model):
    nome = models.CharField(max_length=200, unique=True)
    endereco = models.CharField(max_length=255, blank=True, null=True)
    cnpj = models.CharField(max_length=18, unique=True, blank=True, null=True)
    contato = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.nome

# 3. Informações sobre a fiscalização
class Fiscalizacao(models.Model):
    # Relação com o Usuário (Quem fiscalizou)
    fiscalizador = models.ForeignKey(User, on_delete=models.CASCADE)

    # Relação com o Órgão (O quê foi fiscalizado)
    orgao = models.ForeignKey(OrgaoFiscalizado, on_delete=models.CASCADE)

    data_fiscalizacao = models.DateTimeField(auto_now_add=True)
    
    # Detalhes da ocorrência
    titulo = models.CharField(max_length=255)
    descricao = models.TextField()
    
    # Status (Ex: Em Análise, Concluída, Irregular, Regular)
    STATUS_CHOICES = [
        ('EM_ANALISE', 'Em Análise'),
        ('REGULAR', 'Regular'),
        ('IRREGULAR', 'Irregular'),
    ]
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='EM_ANALISE'
    )

    def __str__(self):
        return f"Fiscalização de {self.orgao.nome} por {self.fiscalizador.username}"