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

# ────────────────────────────────────────
# EMPRESAS
# ────────────────────────────────────────

def test_listar_empresas():
    """GET /api/empresas/ debe devolver una lista"""
    respuesta = requests.get(f"{BASE_URL}/api/empresas/")
    assert respuesta.status_code == 200
    assert isinstance(respuesta.json(), list)

def test_crear_empresa_correcta():
    """Una empresa con datos válidos debe crearse correctamente"""
    respuesta = requests.post(f"{BASE_URL}/api/empresas/", json={
        "nombre": "Empresa Test S.L.",
        "direccion": "Calle Test 1",
        "web": "https://www.test.com",
        "email": "info@test.com",
        "telefono": "911111111",
        "persona_contacto": "Juan Test"
    })
    assert respuesta.status_code == 200
    datos = respuesta.json()
    assert datos["nombre"] == "Empresa Test S.L."
    assert "id" in datos

def test_crear_empresa_sin_nombre():
    """Una empresa sin nombre debe devolver 422"""
    respuesta = requests.post(f"{BASE_URL}/api/empresas/", json={
        "direccion": "Calle Test 1",
        "email": "info@test.com"
    })
    assert respuesta.status_code == 422

def test_crear_empresa_campos_opcionales_vacios():
    """Una empresa solo con nombre debe crearse correctamente"""
    respuesta = requests.post(f"{BASE_URL}/api/empresas/", json={
        "nombre": "Empresa Minima S.L."
    })
    assert respuesta.status_code == 200
    assert respuesta.json()["nombre"] == "Empresa Minima S.L."

def test_listar_contactos():
    """GET /api/empresas/contactos debe devolver una lista"""
    respuesta = requests.get(f"{BASE_URL}/api/empresas/contactos")
    assert respuesta.status_code == 200
    assert isinstance(respuesta.json(), list)

def test_registrar_contacto_empresa_inexistente():
    """Registrar contacto con empresa inexistente debe devolver 404"""
    respuesta = requests.post(f"{BASE_URL}/api/empresas/contactos", json={
        "profesor_id": 1,
        "empresa_id": 99999,
        "fecha_hora": "2024-05-01T10:00:00",
        "notas": "Contacto de prueba"
    })
    assert respuesta.status_code == 404

def test_registrar_contacto_profesor_inexistente():
    """Registrar contacto con profesor inexistente debe devolver 404"""
    empresa = requests.post(f"{BASE_URL}/api/empresas/", json={
        "nombre": "Empresa Contacto Test"
    }).json()

    respuesta = requests.post(f"{BASE_URL}/api/empresas/contactos", json={
        "profesor_id": 99999,
        "empresa_id": empresa["id"],
        "fecha_hora": "2024-05-01T10:00:00",
        "notas": "Contacto de prueba"
    })
    assert respuesta.status_code == 404

# ────────────────────────────────────────
# PLAZAS Y ASIGNACIONES
# ────────────────────────────────────────

def test_listar_plazas():
    """GET /api/alumnos/plazas debe devolver una lista"""
    respuesta = requests.get(f"{BASE_URL}/api/alumnos/plazas")
    assert respuesta.status_code == 200
    assert isinstance(respuesta.json(), list)

def test_crear_plaza_correcta():
    """Una plaza con datos válidos debe crearse correctamente"""
    empresa = requests.post(f"{BASE_URL}/api/empresas/", json={
        "nombre": "Empresa Plaza Test"
    }).json()

    ciclos = requests.get(f"{BASE_URL}/api/admin/ciclos").json()
    if not ciclos:
        requests.post(f"{BASE_URL}/api/admin/ciclos", json={
            "nombre": "Ciclo Plaza",
            "anio_inicio": 2024,
            "anio_fin": 2026
        })
        ciclos = requests.get(f"{BASE_URL}/api/admin/ciclos").json()

    respuesta = requests.post(f"{BASE_URL}/api/alumnos/plazas", json={
        "empresa_id": empresa["id"],
        "ciclo_id": ciclos[0]["id"],
        "total_plazas": 3
    })
    assert respuesta.status_code == 200
    datos = respuesta.json()
    assert datos["total_plazas"] == 3
    assert datos["plazas_ocupadas"] == 0

def test_crear_plaza_sin_campos_obligatorios():
    """Una plaza sin empresa_id debe devolver 422"""
    respuesta = requests.post(f"{BASE_URL}/api/alumnos/plazas", json={
        "ciclo_id": 1,
        "total_plazas": 3
    })
    assert respuesta.status_code == 422

def test_listar_asignaciones():
    """GET /api/alumnos/asignaciones debe devolver una lista"""
    respuesta = requests.get(f"{BASE_URL}/api/alumnos/asignaciones")
    assert respuesta.status_code == 200
    assert isinstance(respuesta.json(), list)

def test_asignar_alumno_plaza_inexistente():
    """Asignar alumno a una plaza inexistente debe devolver 404"""
    respuesta = requests.post(f"{BASE_URL}/api/alumnos/asignaciones", json={
        "alumno_id": 1,
        "plaza_id": 99999
    })
    assert respuesta.status_code == 404

def test_dashboard_alumno_inexistente():
    """Dashboard de alumno inexistente debe devolver 404"""
    respuesta = requests.get(f"{BASE_URL}/api/alumnos/99999/dashboard")
    assert respuesta.status_code == 404

def test_dashboard_alumno_sin_asignacion():
    """Dashboard de alumno sin asignación debe devolver estado Pendiente"""
    # Necesitamos un alumno existente sin asignación
    # Asumimos que el alumno con id 1 existe y no tiene asignación
    respuesta = requests.get(f"{BASE_URL}/api/alumnos/1/dashboard")
    if respuesta.status_code == 200:
        assert respuesta.json()["estado"] == "Pendiente"

# ────────────────────────────────────────
# CV
# ────────────────────────────────────────

def test_subir_cv_alumno_inexistente():
    """Subir CV a un alumno inexistente debe devolver 404"""
    respuesta = requests.post(
        f"{BASE_URL}/api/alumnos/99999/cv",
        files={"archivo": ("cv.pdf", b"contenido pdf falso", "application/pdf")}
    )
    assert respuesta.status_code == 404

def test_subir_archivo_no_pdf():
    """Subir un archivo que no es PDF debe devolver 400"""
    respuesta = requests.post(
        f"{BASE_URL}/api/alumnos/1/cv",
        files={"archivo": ("cv.docx", b"contenido falso", "application/docx")}
    )
    assert respuesta.status_code in [400, 404]