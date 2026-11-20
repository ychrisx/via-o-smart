from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User


class UsuarioSerializer(serializers.ModelSerializer):
    """Converte um User em JSON: {"id": 1, "username": "...", ...}."""

    nome = serializers.CharField(source="get_full_name", read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "nome", "perfil"]


class LoginSerializer(TokenObtainPairSerializer):
    """Recebe username + senha e devolve os tokens JWT e os dados do usuário."""

    def validate(self, attrs):
        # O pai confere a senha, gera "access" e "refresh" e guarda o usuário em self.user.
        dados = super().validate(attrs)
        dados["usuario"] = UsuarioSerializer(self.user).data
        return dados
