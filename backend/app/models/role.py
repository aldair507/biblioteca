from sqlalchemy import Column, Integer, String
from app.services.database import Base

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    rol = Column(String, unique=True, index=True, nullable=False)
    prioridad = Column(Integer, nullable=False)
