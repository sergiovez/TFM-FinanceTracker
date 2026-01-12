from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import CustomUser

# Formulario personalizado para poder meter los ingresos mensuales en el registro
class CustomUserCreationForm(UserCreationForm):
    monthly_income = forms.DecimalField(
        max_digits=10, decimal_places=2,
        required=False,
        help_text="Opcional: ingreso mensual del usuario"
    )

    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = ('username', 'email', 'monthly_income', 'password1', 'password2')
