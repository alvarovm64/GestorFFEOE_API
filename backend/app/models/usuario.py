from sqlalchemy import Column, Integer, String, Enum, Date
from app.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id               = Column(Integer, primary_key=True, index=True)
    nombre           = Column(String(100), nullable=False)
    apellidos        = Column(String(100))
    email            = Column(String(150), unique=True, nullable=False)
    password_hash    = Column(String(255), nullable=False)
    rol              = Column(Enum("admin", "profesor", "alumno"), nullable=False)
    telefono         = Column(String(20))
    dni              = Column(String(20), unique=True)
    fecha_nacimiento = Column(Date)
    direccion        = Column(String(255))