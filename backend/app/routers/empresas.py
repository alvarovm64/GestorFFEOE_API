from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.empresa import Empresa
from app.models.profesor import Profesor
from app.models.contacto import ContactoEmpresa
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class EmpresaCreate(BaseModel):
    nombre: str
    direccion: str | None = None
    web: str | None = None
    email: str | None = None
    telefono: str | None = None
    persona_contacto: str | None = None

class EmpresaResponse(BaseModel):
    id: int
    nombre: str
    direccion: str | None = None
    web: str | None = None
    email: str | None = None
    telefono: str | None = None
    persona_contacto: str | None = None

    class Config:
        from_attributes = True

class ContactoCreate(BaseModel):
    profesor_id: int
    empresa_id: int
    fecha_hora: datetime
    notas: str | None = None

class ContactoResponse(BaseModel):
    id: int
    profesor_id: int
    empresa_id: int
    fecha_hora: datetime
    notas: str | None = None

    class Config:
        from_attributes = True

@router.post("/", response_model=EmpresaResponse)
def crear_empresa(empresa: EmpresaCreate, db: Session = Depends(get_db)):
    nueva = Empresa(**empresa.model_dump())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@router.get("/", response_model=list[EmpresaResponse])
def listar_empresas(db: Session = Depends(get_db)):
    return db.query(Empresa).all()

@router.post("/contactos", response_model=ContactoResponse)
def registrar_contacto(contacto: ContactoCreate, db: Session = Depends(get_db)):
    profesor = db.query(Profesor).filter(Profesor.id == contacto.profesor_id).first()
    if not profesor:
        raise HTTPException(status_code=404, detail="Profesor no encontrado")
    empresa = db.query(Empresa).filter(Empresa.id == contacto.empresa_id).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa no encontrada")
    nuevo = ContactoEmpresa(**contacto.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/contactos", response_model=list[ContactoResponse])
def listar_contactos(db: Session = Depends(get_db)):
    return db.query(ContactoEmpresa).all()