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
