from sqlalchemy import Column, Integer, DateTime, Text, ForeignKey
from app.database import Base

class ContactoEmpresa(Base):
    __tablename__ = "contactos_empresa"

    id          = Column(Integer, primary_key=True, index=True)
    profesor_id = Column(Integer, ForeignKey("profesores.id"), nullable=False)
    empresa_id  = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    fecha_hora  = Column(DateTime, nullable=False)
    notas       = Column(Text)