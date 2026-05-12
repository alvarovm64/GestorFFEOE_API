# GestorFFEOE — Gestión de Prácticas en Empresa

Aplicación web para gestionar la asignación de alumnos a empresas durante el periodo de prácticas en el instituto.

---

## Stack Tecnológico

- **Backend**: Python con FastAPI
- **Frontend**: JavaScript (React)
- **Base de Datos**: MariaDB (MySQL)
- **Autenticación**: JWT (JSON Web Tokens)
- **Documentación API**: Swagger/OpenAPI (disponible en `/docs`)
- **Control de versiones**: Git con flujo de trabajo por ramas y Pull Requests

---

## Estructura del Proyecto

```
GestorFFEOE_API/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py        # Variables de entorno
│   │   │   └── security.py      # JWT y hashing de contraseñas
│   │   ├── models/              # Modelos SQLAlchemy (tablas)
│   │   ├── routers/             # Endpoints agrupados por rol
│   │   ├── services/            # Lógica de negocio (CSV, etc.)
│   │   ├── database.py          # Conexión a la base de datos
│   │   ├── dependencies.py      # Protección de rutas por rol
│   │   └── main.py              # Punto de entrada de la API
│   ├── database/
│   │   └── schema.sql           # Esquema de la base de datos
│   ├── uploads/                 # CVs subidos por los alumnos
│   ├── .env                     # Variables de entorno (no subir a Git)
│   ├── requirements.txt         # Dependencias Python
│   └── start.bat                # Script para arrancar el servidor (Windows)
└── frontend/                    # (Desarrollado por el equipo de frontend)
```

---

## Requisitos Previos

- Python 3.10 o superior
- Docker Desktop con un contenedor MariaDB corriendo
- Git

---

## Instalación y Puesta en Marcha

### 1. Clona el repositorio

```bash
git clone https://github.com/alvarovm64/GestorFFEOE_API.git
cd GestorFFEOE_API/backend
```

### 2. Crea el entorno virtual

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 3. Instala las dependencias

```bash
pip install -r requirements.txt
```

### 4. Configura las variables de entorno

Crea un archivo `.env` en la carpeta `backend/`:

```env
DATABASE_URL=mysql+pymysql://root:TU_PASSWORD@127.0.0.1:3306/gestor_practicas
SECRET_KEY=una_clave_secreta_larga
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### 5. Crea la base de datos

Ejecuta el archivo `database/schema.sql` en tu gestor de base de datos (HeidiSQL, DBeaver, etc.).

### 6. Arranca el servidor

```bash
uvicorn app.main:app --reload
```

O en Windows haz doble clic en `start.bat`.

---

## Documentación de la API

Con el servidor arrancado, accede a:

```
http://127.0.0.1:8000/docs
```

También puedes descargar el esquema OpenAPI en:

```
http://127.0.0.1:8000/openapi.json
```

---

## Endpoints Principales

### Autenticación
| Método | Endpoint | Descripción | Protección |
|--------|----------|-------------|------------|
| POST | `/api/auth/login` | Login y obtención de token JWT | Pública |

### Admin
| Método | Endpoint | Descripción | Protección |
|--------|----------|-------------|------------|
| GET | `/api/admin/ciclos` | Listar ciclos | Admin |
| POST | `/api/admin/ciclos` | Crear ciclo | Admin |
| DELETE | `/api/admin/ciclos/{id}` | Eliminar ciclo | Admin |

### Profesores
| Método | Endpoint | Descripción | Protección |
|--------|----------|-------------|------------|
| GET | `/api/profesores/` | Listar profesores | Público |
| POST | `/api/profesores/` | Crear profesor | Público |
| POST | `/api/profesores/importar-alumnos` | Importar alumnos por CSV | Profesor/Admin |
| POST | `/api/profesores/importar-empresas` | Importar empresas por CSV | Profesor/Admin |

### Empresas
| Método | Endpoint | Descripción | Protección |
|--------|----------|-------------|------------|
| GET | `/api/empresas/` | Listar empresas | Público |
| POST | `/api/empresas/` | Crear empresa | Profesor/Admin |
| GET | `/api/empresas/contactos` | Listar contactos | Público |
| POST | `/api/empresas/contactos` | Registrar contacto | Profesor/Admin |

### Alumnos
| Método | Endpoint | Descripción | Protección |
|--------|----------|-------------|------------|
| GET | `/api/alumnos/plazas` | Listar plazas | Público |
| POST | `/api/alumnos/plazas` | Crear plaza | Profesor/Admin |
| GET | `/api/alumnos/asignaciones` | Listar asignaciones | Público |
| POST | `/api/alumnos/asignaciones` | Asignar alumno a plaza | Profesor/Admin |
| GET | `/api/alumnos/{id}/dashboard` | Dashboard del alumno | Público |
| POST | `/api/alumnos/{id}/cv` | Subir CV en PDF | Público |

---

## Autenticación JWT

Los endpoints protegidos requieren el token en el header:

```
Authorization: Bearer <token>
```

El token se obtiene haciendo login en `/api/auth/login` y expira a los 60 minutos.

---

## Formato CSV

### Alumnos
```csv
nombre,email,password
Juan García,juan@ejemplo.com,1234
María López,maria@ejemplo.com,1234
```

### Empresas
```csv
nombre,direccion,web,email,telefono,persona_contacto
Empresa SL,Calle Mayor 1,www.empresa.com,info@empresa.com,666666666,Juan Pérez
```

---

## Flujo de Trabajo Git

- La rama `main` está protegida. No se puede subir código directamente.
- Cada funcionalidad se desarrolla en una rama separada: `feat/nombre-funcionalidad`
- Para fusionar con `main` es obligatorio crear una Pull Request y obtener al menos una aprobación.

---

## Equipo

| Rol | Responsabilidad |
|-----|----------------|
| Alumno A (Backend) | API REST, Base de datos, CSV, JWT |
| Alumno B (Frontend) | Vistas, Formularios, Dashboard |
| Alumno C (QA) | Tests unitarios, Seguridad, Validaciones |
