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

# ────────────────────────────────────────
# CICLOS
# ────────────────────────────────────────

def test_listar_ciclos():
    """GET /api/admin/ciclos debe devolver una lista"""
    respuesta = requests.get(f"{BASE_URL}/api/admin/ciclos")
    assert respuesta.status_code == 200
    assert isinstance(respuesta.json(), list)

def test_crear_ciclo_correcto():
    """Un ciclo con datos válidos debe crearse correctamente"""
    ciclos = requests.get(f"{BASE_URL}/api/admin/ciclos").json()
    for ciclo in ciclos:
        if ciclo["nombre"] == "Test Ciclo":
            requests.delete(f"{BASE_URL}/api/admin/ciclos/{ciclo['id']}")

    respuesta = requests.post(f"{BASE_URL}/api/admin/ciclos", json={
        "nombre": "Test Ciclo",
        "anio_inicio": 2024,
        "anio_fin": 2026
    })
    assert respuesta.status_code == 200
    datos = respuesta.json()
    assert datos["nombre"] == "Test Ciclo"
    assert datos["anio_inicio"] == 2024
    assert datos["anio_fin"] == 2026

def test_crear_ciclo_sin_nombre():
    """Un ciclo sin nombre debe devolver 422"""
    respuesta = requests.post(f"{BASE_URL}/api/admin/ciclos", json={
        "anio_inicio": 2024,
        "anio_fin": 2026
    })
    assert respuesta.status_code == 422

def test_crear_ciclo_sin_anio_inicio():
    """Un ciclo sin año de inicio debe devolver 422"""
    respuesta = requests.post(f"{BASE_URL}/api/admin/ciclos", json={
        "nombre": "Ciclo Sin Inicio",
        "anio_fin": 2026
    })
    assert respuesta.status_code == 422

def test_eliminar_ciclo_correcto():
    """Un ciclo existente debe eliminarse correctamente"""
    ciclo = requests.post(f"{BASE_URL}/api/admin/ciclos", json={
        "nombre": "Ciclo A Eliminar",
        "anio_inicio": 2024,
        "anio_fin": 2026
    }).json()

    respuesta = requests.delete(f"{BASE_URL}/api/admin/ciclos/{ciclo['id']}")
    assert respuesta.status_code == 200
    assert respuesta.json()["mensaje"] == "Ciclo eliminado"

def test_eliminar_ciclo_inexistente():
    """Eliminar un ciclo que no existe debe devolver 404"""
    respuesta = requests.delete(f"{BASE_URL}/api/admin/ciclos/99999")
    assert respuesta.status_code == 404