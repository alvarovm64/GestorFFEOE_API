from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.ciclo import Ciclo
from app.dependencies import solo_admin, get_usuario_actual
from pydantic import BaseModel

router = APIRouter()

class CicloCreate(BaseModel):
    nombre: str
    anio_inicio: int
    anio_fin: int

class CicloResponse(BaseModel):
    id: int
    nombre: str
    anio_inicio: int
    anio_fin: int

    class Config:
        from_attributes = True

@router.post("/ciclos", response_model=CicloResponse)
def crear_ciclo(ciclo: CicloCreate, db: Session = Depends(get_db), admin=Depends(solo_admin)):
    nuevo = Ciclo(**ciclo.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/ciclos", response_model=list[CicloResponse])
def listar_ciclos(db: Session = Depends(get_db), usuario=Depends(get_usuario_actual)):
    return db.query(Ciclo).all()

@router.delete("/ciclos/{ciclo_id}")
def eliminar_ciclo(ciclo_id: int, db: Session = Depends(get_db), admin=Depends(solo_admin)):
    ciclo = db.query(Ciclo).filter(Ciclo.id == ciclo_id).first()
    if not ciclo:
        raise HTTPException(status_code=404, detail="Ciclo no encontrado")
    db.delete(ciclo)
    db.commit()
    return {"mensaje": "Ciclo eliminado"}