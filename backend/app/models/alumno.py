from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class Alumno(Base):
    __tablename__ = "alumnos"

    id          = Column(Integer, primary_key=True, index=True)
    usuario_id  = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    ciclo_id    = Column(Integer, ForeignKey("ciclos.id"), nullable=False)
    cv_pdf_path = Column(String(255))