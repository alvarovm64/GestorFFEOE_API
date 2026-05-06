import csv
import io
from sqlalchemy.orm import Session
from app.models.usuario import Usuario
from app.models.alumno import Alumno
from app.models.empresa import Empresa
from app.core.security import hash_password

def importar_alumnos_csv(contenido: bytes, ciclo_id: int, db: Session) -> dict:
    decoded = contenido.decode("utf-8")
    reader = csv.DictReader(io.StringIO(decoded))
    creados = 0
    errores = []

    for fila in reader:
        try:
            usuario = Usuario(
                nombre=fila["nombre"],
                email=fila["email"],
                password_hash=hash_password(fila["password"]),
                rol="alumno"
            )
            db.add(usuario)
            db.flush()
            alumno = Alumno(usuario_id=usuario.id, ciclo_id=ciclo_id)
            db.add(alumno)
            creados += 1
        except Exception as e:
            errores.append({"fila": fila, "error": str(e)})

    db.commit()
    return {"creados": creados, "errores": errores}

def importar_empresas_csv(contenido: bytes, db: Session) -> dict:
    decoded = contenido.decode("utf-8")
    reader = csv.DictReader(io.StringIO(decoded))
    creadas = 0
    errores = []

    for fila in reader:
        try:
            empresa = Empresa(
                nombre=fila["nombre"],
                direccion=fila.get("direccion"),
                web=fila.get("web"),
                email=fila.get("email"),
                telefono=fila.get("telefono"),
                persona_contacto=fila.get("persona_contacto")
            )
            db.add(empresa)
            creadas += 1
        except Exception as e:
            errores.append({"fila": fila, "error": str(e)})

    db.commit()
    return {"creadas": creadas, "errores": errores}