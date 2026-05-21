from sqlalchemy import Column, Integer, String
from app.database import Base

class Ciclo(Base):
    __tablename__ = "ciclos"

    id          = Column(Integer, primary_key=True, index=True)
    nombre      = Column(String(100), nullable=False)
    año_inicio = Column(Integer, nullable=False)
    año_fin    = Column(Integer, nullable=False)