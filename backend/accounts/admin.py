from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["username", "first_name", "perfil", "is_active"]
    list_filter = ["perfil", "is_active"]
    # Acrescenta o campo "perfil" nas telas de editar e de criar usuário.
    fieldsets = BaseUserAdmin.fieldsets + (("Perfil no sistema", {"fields": ["perfil"]}),)
    add_fieldsets = BaseUserAdmin.add_fieldsets + (("Perfil no sistema", {"fields": ["perfil"]}),)
