from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.plaza import Plaza
from app.models.asignacion import Asignacion
from app.models.alumno import Alumno
from pydantic import BaseModel
from app.dependencies import solo_profesor


router = APIRouter()

class PlazaCreate(BaseModel):
    empresa_id: int
    ciclo_id: int
    total_plazas: int

class PlazaResponse(BaseModel):
    id: int
    empresa_id: int
    ciclo_id: int
    total_plazas: int
    plazas_ocupadas: int

    class Config:
        from_attributes = True

class AsignacionCreate(BaseModel):
    alumno_id: int
    plaza_id: int
    tutor_laboral_id: int | None = None

class AsignacionResponse(BaseModel):
    id: int
    alumno_id: int
    plaza_id: int
    tutor_laboral_id: int | None = None
    estado: str

    class Config:
        from_attributes = True

from fastapi import UploadFile, File
import shutil
import os

@router.post("/{alumno_id}/cv")
async def subir_cv(alumno_id: int, archivo: UploadFile = File(...), db: Session = Depends(get_db)):
    alumno = db.query(Alumno).filter(Alumno.id == alumno_id).first()
    if not alumno:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")
    if not archivo.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Solo se permiten archivos PDF")
    
    carpeta = "uploads/cvs"
    os.makedirs(carpeta, exist_ok=True)
    ruta = f"{carpeta}/alumno_{alumno_id}.pdf"
    
    with open(ruta, "wb") as buffer:
        shutil.copyfileobj(archivo.file, buffer)
    
    alumno.cv_pdf_path = ruta
    db.commit()
    
    return {"mensaje": "CV subido correctamente", "ruta": ruta}

    from app.dependencies import solo_profesor

@router.post("/plazas", response_model=PlazaResponse)
def crear_plaza(plaza: PlazaCreate, db: Session = Depends(get_db), profesor=Depends(solo_profesor)):
    nueva = Plaza(**plaza.model_dump())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@router.get("/plazas", response_model=list[PlazaResponse])
def listar_plazas(db: Session = Depends(get_db)):
    return db.query(Plaza).all()

@router.post("/asignaciones", response_model=AsignacionResponse)
def asignar_alumno(asignacion: AsignacionCreate, db: Session = Depends(get_db), profesor=Depends(solo_profesor)):
    plaza = db.query(Plaza).filter(Plaza.id == asignacion.plaza_id).first()
    if not plaza:
        raise HTTPException(status_code=404, detail="Plaza no encontrada")
    if plaza.plazas_ocupadas >= plaza.total_plazas:
        raise HTTPException(status_code=400, detail="No hay plazas disponibles")
    nueva = Asignacion(**asignacion.model_dump())
    db.add(nueva)
    plaza.plazas_ocupadas += 1
    db.commit()
    db.refresh(nueva)
    return nueva

@router.get("/asignaciones", response_model=list[AsignacionResponse])
def listar_asignaciones(db: Session = Depends(get_db)):
    return db.query(Asignacion).all()

@router.get("/{alumno_id}/dashboard")
def dashboard_alumno(alumno_id: int, db: Session = Depends(get_db)):
    alumno = db.query(Alumno).filter(Alumno.id == alumno_id).first()
    if not alumno:
        raise HTTPException(status_code=404, detail="Alumno no encontrado")
    asignacion = db.query(Asignacion).filter(Asignacion.alumno_id == alumno_id).first()
    if not asignacion:
        return {"estado": "Pendiente", "empresa": None, "tutor": None}
    plaza = db.query(Plaza).filter(Plaza.id == asignacion.plaza_id).first()
    return {
        "estado": asignacion.estado,
        "empresa_id": plaza.empresa_id if plaza else None,
        "tutor_laboral_id": asignacion.tutor_laboral_id
    }