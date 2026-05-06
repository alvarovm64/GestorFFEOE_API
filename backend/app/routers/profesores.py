from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.profesor import Profesor
from app.models.usuario import Usuario
from app.models.ciclo import Ciclo
from pydantic import BaseModel

router = APIRouter()

class ProfesorCreate(BaseModel):
    usuario_id: int
    ciclo_id: int

class ProfesorResponse(BaseModel):
    id: int
    usuario_id: int
    ciclo_id: int

    class Config:
        from_attributes = True

@router.post("/", response_model=ProfesorResponse)
def crear_profesor(profesor: ProfesorCreate, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.id == profesor.usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    ciclo = db.query(Ciclo).filter(Ciclo.id == profesor.ciclo_id).first()
    if not ciclo:
        raise HTTPException(status_code=404, detail="Ciclo no encontrado")
    nuevo = Profesor(**profesor.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/", response_model=list[ProfesorResponse])
def listar_profesores(db: Session = Depends(get_db)):
    return db.query(Profesor).all()

@router.delete("/{profesor_id}")
def eliminar_profesor(profesor_id: int, db: Session = Depends(get_db)):
    profesor = db.query(Profesor).filter(Profesor.id == profesor_id).first()
    if not profesor:
        raise HTTPException(status_code=404, detail="Profesor no encontrado")
    db.delete(profesor)
    db.commit()
    return {"mensaje": "Profesor eliminado"}