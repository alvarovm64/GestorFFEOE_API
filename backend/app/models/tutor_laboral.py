from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class TutorLaboral(Base):
    __tablename__ = "tutores_laborales"

    id         = Column(Integer, primary_key=True, index=True)
    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    dni        = Column(String(20), nullable=False)
    telefono   = Column(String(20))