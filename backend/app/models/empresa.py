from sqlalchemy import Column, Integer, String
from app.database import Base

class Empresa(Base):
    __tablename__ = "empresas"

    id               = Column(Integer, primary_key=True, index=True)
    nombre           = Column(String(150), nullable=False)
    direccion        = Column(String(255))
    web              = Column(String(150))
    email            = Column(String(150))
    telefono         = Column(String(20))
    persona_contacto = Column(String(100))