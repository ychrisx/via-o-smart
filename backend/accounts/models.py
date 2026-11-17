from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Usuário do sistema. Herda username, senha, e-mail, is_staff... do Django."""

    class Perfil(models.TextChoices):
        ADMINISTRADOR = "administrador", "Administrador"
        MOTORISTA = "motorista", "Motorista"

    # O perfil decide para qual tela o usuário vai depois do login.
    perfil = models.CharField(max_length=20, choices=Perfil.choices, default=Perfil.MOTORISTA)

    # Campos que o "createsuperuser" pergunta além de username e senha.
    REQUIRED_FIELDS = ["email", "perfil"]

MANAGED = False #false porque não há tabela nenhuma no supabase

""" Ajustes feitos em relação ao brModelo (o Django não funciona sem eles):
  * Toda tabela precisa de chave primária. Ganharam `id` automático:
    recibo_motorista, recibo_multa, viagem e as tabelas de ligação (usa, revisa,
    gere, relacionamento_3, vira).
  * cliente não tinha PK, mas a tabela `vira` aponta para cliente.CPF,
    então CPF virou a chave primária de cliente.
  * recibo_motorista estava sem tipos — os tipos abaixo são uma sugestão (veja os comentários).
  * VARCHAR sem tamanho -> CharField(max_length=255) ou TextField (texto longo).
  * Nas tabelas de ligação usei CASCADE em vez de SET NULL (uma linha de ligação
    com a chave nula não serve para nada) e impedi pares duplicados.
"""

# FINANACEIRO/Sistema/Empresa

class Financeiro(models.Model):
    id_finaneiro = models.Auto.Field(primary_key=True)
    saldo = models.DecimalField(max_digits=12,
decimal_places=2, blank=True, null=True)
    gastos = models.DecimalField(max_digits=12,
decimal_places=2, blank=True, null=True)
    contratos = models.DecimalField(max_digits=12,
decimal_places=2, blank=True, null=True)

#Financeiro <-> estoque (tabela revisa)
    estoques_revisados = models.ManyToManyField(
        Estoque, through='Revisa', 
        related_name="financeiros", blank=True
    )

    class Meta:
        managed = MANAGED
        db_table = "financeiro"

class Sistema(models.Model):
        """Cadastro/login do sistema. Avalie trocar por django.contrib.auth (User) ou Supabase.Auth""" #não sei o que o calude quis dizer com isso ele quis botar um autenticação? ver depois
        id_cadastro = models.AutoField(primary_key=True)
        login = models.CharField(max_length=255,
blank=True, null=True)
        cadastro = models.CharField(max_length=255,
blank=True, null=True)
        senha = models.CharField(max_length=255,
blank=True, null=True)

    #Sistema <-> Financeiro (tabela usa)
    financeiros = models.ManyToManyField(
        Financeiro, through="Usa",
        related_name="sistemas", blank=True
    )

    class Meta:
        managed = MANAGED
        db_table = "sistema"

    def __str__(self):
        return self.login or f"Cadastro {self.pk}"


class Empresa(models.Model):
    id_empresa = models.AutoField(primary_key=True)
    alugel_veiculo = models.CharField(max_length=255,
blank=True, null=True)
    equipes_limpeza = models.CharField(max_length=255,
blank=True, null=True)
    equipes_manutencao = models.CharField(max_length=255,
blank=True, null=True)
    seguradoras = models.CharField(max_length=255,
blank=True, null=True)

    #Empres <-> Produto (tabela gere)
    produtos = models.ManyToManyField(Produto, throught="Gere",
    related_name="empresas", blank=True
    )

    class Meta:
        manged = MANAGED
        db_table = "empresa"

# Frota / Estoque

class Estoque(models.Model):
    id_estoque = models.AutoField(primary_key=True)
    placa = models.CharField(max_length=255, blank=True, null=True)
    modelo = models.CharField(max_length=255, blank=True, null=True)
    viagem = models.CharField(max_length=255, blank=True, null=True)
    numero_frota = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = MANAGED
        db_table = "estoque"

    def __str__(self):
        return f"{self.placa or ''} {self.modelo or ''}".strip() or f"Estoque {self.pk}"


class Produto(models.Model):
    id_produto = models.AutoField(primary_key=True)
    valor = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    tipo = models.CharField(max_length=255, blank=True, null=True)

    # Estoque <-> Produto (tabela Relacionamento_3) po Rhuan tinha que dar nome e vc primas nao avisou tbm!
    estoques = models.ManyToManyField(
        Estoque, through="EstoqueProduto", related_name="produtos", blank=True
    )

    class Meta:
        managed = MANAGED
        db_table = "produto"

    def __str__(self):
        return self.tipo or f"Produto {self.pk}"

# Motorista / RH

class Motorista(models.Model):
    id_motorista = models.AutoField(primary_key=True)
    login = models.CharField(max_length=255, blank=True, null=True)
    # ATENÇÃO: nunca grave a senha em texto puro. Use make_password()/check_password() do Django, ou deixe o login a cargo do Supabase Auth / django.contrib.auth.
    # Dica ai deixada pelo claude não sei que comandos são esses de salvar senha, precisa mesmo? achei que esse auth era de autenticação
    senha_motorista = models.CharField(max_length=255, blank=True, null=True)
    cnh = models.CharField(max_length=255, blank=True, null=True)
    abastecimento = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    manutencao = models.TextField(blank=True, null=True)
    ocorrencias = models.TextField(blank=True, null=True)
    entrada = models.TimeField(blank=True, null=True)
    saida = models.TimeField(blank=True, null=True)

    # Estoque (0,1) ---- (0,N) Motorista  | ON DELETE SET NULL
    estoque = models.ForeignKey(
        Estoque,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column="fk_estoque_id_estoque",
        related_name="motoristas",
    )

    class Meta:
        managed = MANAGED
        db_table = "motorista"

    def __str__(self):
        return self.login or f"Motorista {self.pk}"


class RH(models.Model):
    id_rh = models.AutoField(primary_key=True)
    ferias_membro = models.CharField(max_length=255, blank=True, null=True)
    atestados_saude = models.TextField(blank=True, null=True)
    safistacao_trabalho = models.TextField(blank=True, null=True)  # (sic) "safistacao" como no modelo
    conduta_ambiente_trabalho = models.TextField(blank=True, null=True)
    relatorio_ocorrencia = models.TextField(blank=True, null=True)

    # Motorista (1,1) ---- (0,N) RH  | ON DELETE CASCADE 
    motorista = models.ForeignKey(
        Motorista,
        on_delete=models.CASCADE,
        db_column="fk_motorista_id_motorista",
        related_name="registros_rh",
    )

    class Meta:
        managed = MANAGED
        db_table = "rh"
        verbose_name = "RH"
        verbose_name_plural = "RH"

# Comercial: Lead / Cliente

class Lead(models.Model):
    id_lead = models.AutoField(primary_key=True)
    viagens_proximas = models.TextField(blank=True, null=True)
    contatos = models.TextField(blank=True, null=True)
    propostas_antigas = models.TextField(blank=True, null=True)
    negociacoes = models.TextField(blank=True, null=True)
    prioridades = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = MANAGED
        db_table = "lead"

class Cliente(models.Model):
    # No brModelo a tabela não tinha PK; CPF virou PK porque "vira" referencia cliente.CPF.
    cpf = models.CharField(max_length=14, primary_key=True)
    nome = models.CharField(max_length=255, blank=True, null=True)
    telefone = models.CharField(max_length=30, blank=True, null=True)
    endereco = models.CharField(max_length=255, blank=True, null=True)
    cnh = models.CharField(max_length=255, blank=True, null=True)
    metodo_pagamento = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = MANAGED
        db_table = "cliente"

    def __str__(self):
        return self.nome or self.cpf

# Recibos / Viagem

class ReciboCliente(models.Model):
    id_emissor = models.AutoField(primary_key=True)
    nome_emissor = models.CharField(max_length=255, blank=True, null=True)
    numero_contrato = models.CharField(max_length=255, blank=True, null=True)
    valor_contrato = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    nome_emitente = models.CharField(max_length=255, blank=True, null=True)
    endereco = models.CharField(max_length=255, blank=True, null=True)
    telefone = models.CharField(max_length=30, blank=True, null=True)
    data_emissao = models.DateField(blank=True, null=True)
    cnpj = models.CharField(max_length=18, blank=True, null=True)

    class Meta:
        managed = MANAGED
        db_table = "recibo_cliente"


class ReciboMotorista(models.Model):
    # Sem PK e sem tipos no brModelo: `id` automático e tipos sugeridos abaixo pelo claude, poxa Primoselli vc falou que tinha verificado meu!
    numero_contrato = models.CharField(max_length=255, blank=True, null=True)
    data_emissao = models.DateField(blank=True, null=True)
    valor_comissao = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    valor_diaria = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    valor_adiantamento = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    valor_total = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    previsao_chegada = models.DateTimeField(blank=True, null=True)
    previsao_saida = models.DateTimeField(blank=True, null=True)
    nome_motorista = models.CharField(max_length=255, blank=True, null=True)  # sugestão: FK p/ Motorista pelo claude
    id_veiculo = models.IntegerField(blank=True, null=True)                    # sugestão: FK p/ Estoque pelo calude
    local = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = MANAGED
        db_table = "recibo_motorista"


class ReciboMulta(models.Model):
    # Sem PK no brModelo: `id` automático.
    nome_funcionario = models.CharField(max_length=255, blank=True, null=True)
    cpf = models.CharField(max_length=14, blank=True, null=True)
    referencia = models.CharField(max_length=255, blank=True, null=True)
    dados_infracao = models.TextField(blank=True, null=True)
    placa = models.CharField(max_length=255, blank=True, null=True)
    descricao = models.TextField(blank=True, null=True)
    parcela = models.CharField(max_length=255, blank=True, null=True)
    referencia_pagamento = models.CharField(max_length=255, blank=True, null=True)
    valor_parcela = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    valor_total = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = MANAGED
        db_table = "recibo_multa"


class Viagem(models.Model):
    # Sem PK no brModelo: `id` automático.
    id_veiculo = models.IntegerField(blank=True, null=True)  # sugestão: FK p/ Estoque pelo calude
    nome_motorista = models.CharField(max_length=255, blank=True, null=True)  # sugestão: FK p/ Motorista pelo claude
    nome_contratante = models.CharField(max_length=255, blank=True, null=True)
    nome_responsavel = models.CharField(max_length=255, blank=True, null=True)
    contrato = models.CharField(max_length=255, blank=True, null=True)
    itinerario = models.TimeField(blank=True, null=True)  # no modelo está TIME, confirmar se é isso mesmo depois hein!!
    trajeto = models.TextField(blank=True, null=True)
    data = models.DateField(blank=True, null=True)
    km_saida_garagem = models.CharField(max_length=255, blank=True, null=True)
    km_chegada_cliente = models.CharField(max_length=255, blank=True, null=True)
    km_chegada_destino = models.CharField(max_length=255, blank=True, null=True)
    data_hora_retorno = models.DateTimeField(blank=True, null=True)  # nome sugere DateTimeField, logo eu deixei DateTimeField, antes tava apenas TiemField
    km = models.CharField(max_length=255, blank=True, null=True)
    km_ret_cliente = models.CharField(max_length=255, blank=True, null=True)
    km_chegada_garagem = models.CharField(max_length=255, blank=True, null=True)

    # recibo_cliente (1,1) ---- (0,1) Viagem  | ON DELETE CASCADE  -> relação 1:1 (ele quis separar aqui)
    recibo_cliente = models.OneToOneField(
        ReciboCliente,
        on_delete=models.CASCADE,
        db_column="fk_recibo_cliente_id_emissor",
        related_name="viagem",
    )

    class Meta:
        managed = MANAGED
        db_table = "viagem"
        verbose_name_plural = "viagens"

# Tabelas de ligação (relacionamentos N:N do conceitual)

class Usa(models.Model):
    """Sistema N:N Financeiro"""
    financeiro = models.ForeignKey(Financeiro, on_delete=models.CASCADE,
                db_column="fk_financeiro_id_financeiro")
    sistema = models.ForeignKey(Sistema, on_delete=models.CASCADE,
                db_column="fk_sistema_id_cadastro")

    class Meta:
        managed = MANAGED
        db_table = "usa"
        constraints = [models.UniqueConstraint(fields=["financeiro", "sistema"], name="uq_usa")]


class Revisa(models.Model):
    """Financeiro N:N Estoque"""
    estoque = models.ForeignKey(Estoque, on_delete=models.CASCADE,
                db_column="fk_estoque_id_estoque")
    financeiro = models.ForeignKey(Financeiro, on_delete=models.CASCADE,
                db_column="fk_financeiro_id_financeiro")

    class Meta:
        managed = MANAGED
        db_table = "revisa"
        constraints = [models.UniqueConstraint(fields=["estoque", "financeiro"], name="uq_revisa")]


class Gere(models.Model):
    """Empresa N:N Produto"""
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE,
                db_column="fk_produto_id_produto")
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE,
                db_column="fk_empresa_id_empresa")

    class Meta:
        managed = MANAGED
        db_table = "gere"
        constraints = [models.UniqueConstraint(fields=["produto", "empresa"], name="uq_gere")]


class EstoqueProduto(models.Model):
    """Estoque N:N Produto — no brModelo se chama "Relacionamento_3" (vale renomear)."""
    estoque = models.ForeignKey(Estoque, on_delete=models.CASCADE,
                db_column="fk_estoque_id_estoque")
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE,
                db_column="fk_produto_id_produto")

    class Meta:
        managed = MANAGED
        db_table = "relacionamento_3"
        constraints = [models.UniqueConstraint(fields=["estoque", "produto"], name="uq_estoque_produto")]


class Vira(models.Model):
    """Lead (0,1) vira (0,1) Cliente — relação 1:1."""
    lead = models.OneToOneField(Lead, on_delete=models.CASCADE,
                db_column="fk_lead_id_lead", related_name="conversao")
    cliente = models.OneToOneField(Cliente, on_delete=models.CASCADE,
                db_column="fk_cliente_cpf", related_name="origem_lead")

    class Meta:
        managed = MANAGED
        db_table = "vira"

#notinha especial pro PRIMOSELLI!

#A tabela "usado" não foi incluida pelo claude
# No brModelo, "usado" tem só fk_Estoque_id_estoque (falta o outro lado do relacionamento,
# provavelmente uma entidade apagada do conceitual, sla dá uma olha nisso aí). Do jeito que está não guarda nada útil.
# Quando definirmos quem "usa" o estoque, ficaria assim ( no caso já definimos que é o administrativo né e o financeiro tbm):
#
# class Usado(models.Model):
#     estoque = models.ForeignKey(Estoque, on_delete=models.CASCADE, db_column="fk_estoque_id_estoque")
#     outra = models.ForeignKey("OutraTabela", on_delete=models.CASCADE, db_column="fk_outra_id")
#     class Meta:
#         managed = MANAGED
#         db_table = "usado"
