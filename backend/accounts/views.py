from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import LoginSerializer, UsuarioSerializer


class LoginView(TokenObtainPairView):
    """POST /api/auth/login/  {"username": "...", "password": "..."}"""

    serializer_class = LoginSerializer


class MeView(APIView):
    """GET /api/auth/me/  (com o cabeçalho Authorization: Bearer <access>)"""

    def get(self, request):
        return Response(UsuarioSerializer(request.user).data)
