from sqlalchemy import Column, Integer, ForeignKey, CheckConstraint
from app.database import Base

class Plaza(Base):
    __tablename__ = "plazas"

    id             = Column(Integer, primary_key=True, index=True)
    empresa_id     = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    ciclo_id       = Column(Integer, ForeignKey("ciclos.id"), nullable=False)
    total_plazas   = Column(Integer, nullable=False)
    plazas_ocupadas = Column(Integer, default=0)

    __table_args__ = (
        CheckConstraint("plazas_ocupadas <= total_plazas", name="chk_plazas"),
    )