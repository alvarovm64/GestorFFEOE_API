from sqlalchemy import Column, Integer, ForeignKey, Enum
from app.database import Base

class Asignacion(Base):
    __tablename__ = "asignaciones"

    id               = Column(Integer, primary_key=True, index=True)
    alumno_id        = Column(Integer, ForeignKey("alumnos.id"), nullable=False)
    plaza_id         = Column(Integer, ForeignKey("plazas.id"), nullable=False)
    tutor_laboral_id = Column(Integer, ForeignKey("tutores_laborales.id"), nullable=True)
    estado           = Column(Enum("pendiente", "aceptada", "rechazada", "finalizada"), default="pendiente")