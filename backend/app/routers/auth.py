from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.usuario import Usuario
from pydantic import BaseModel
from app.core.security import verify_password, create_access_token, hash_password

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    rol: str
    nombre: str

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == data.email).first()
    if not usuario:
        raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")
    if not verify_password(data.password, usuario.password_hash):
        raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")
    
    token = create_access_token(data={"sub": str(usuario.id), "rol": usuario.rol})
    return {
        "access_token": token,
        "token_type": "bearer",
        "rol": usuario.rol,
        "nombre": usuario.nombre
    }

    from app.core.security import hash_password
from datetime import date

class RegisterRequest(BaseModel):
    nombre: str
    apellidos: str | None = None
    email: str
    password: str
    rol: str = "alumno"
    telefono: str | None = None
    dni: str | None = None
    fecha_nacimiento: date | None = None
    direccion: str | None = None

class RegisterResponse(BaseModel):
    id: int
    nombre: str
    apellidos: str | None = None
    email: str
    rol: str

    class Config:
        from_attributes = True

@router.post("/register", response_model=RegisterResponse)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    usuario_existente = db.query(Usuario).filter(Usuario.email == data.email).first()
    if usuario_existente:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    nuevo = Usuario(
        nombre=data.nombre,
        apellidos=data.apellidos,
        email=data.email,
        password_hash=hash_password(data.password),
        rol=data.rol,
        telefono=data.telefono,
        dni=data.dni,
        fecha_nacimiento=data.fecha_nacimiento,
        direccion=data.direccion
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo