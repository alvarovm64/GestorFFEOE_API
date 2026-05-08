import pytest
import requests

BASE_URL = "http://127.0.0.1:8000"

# ────────────────────────────────────────
# HELPERS
# ────────────────────────────────────────

def obtener_token(email: str, password: str) -> str:
    """Hace login y devuelve el token de acceso"""
    respuesta = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": email,
        "password": password
    })
    if respuesta.status_code == 200:
        return respuesta.json().get("access_token")
    return None


# ────────────────────────────────────────
# AUTH
# ────────────────────────────────────────

def test_login_correcto():
    """Un usuario válido debe recibir un token JWT"""
    respuesta = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": "admin@test.com",
        "password": "admin1234"
    })
    assert respuesta.status_code == 200
    datos = respuesta.json()
    assert "access_token" in datos
    assert datos["token_type"] == "bearer"
    assert datos["rol"] in ["admin", "profesor", "alumno"]

def test_login_password_incorrecta():
    """Contraseña incorrecta debe devolver 401"""
    respuesta = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": "admin@test.com",
        "password": "incorrecta"
    })
    assert respuesta.status_code == 401

def test_login_usuario_inexistente():
    """Un email que no existe debe devolver 401"""
    respuesta = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": "noexiste@test.com",
        "password": "admin1234"
    })
    assert respuesta.status_code == 401

def test_login_sin_campos():
    """Sin campos debe devolver 422"""
    respuesta = requests.post(f"{BASE_URL}/api/auth/login", json={})
    assert respuesta.status_code == 422

def test_login_devuelve_nombre_y_rol():
    """El login debe devolver el nombre y rol del usuario"""
    respuesta = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": "admin@test.com",
        "password": "admin1234"
    })
    assert respuesta.status_code == 200
    datos = respuesta.json()
    assert "nombre" in datos
    assert "rol" in datos