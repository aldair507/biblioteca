# app/models/role.py
from sqlalchemy import Column, Integer, String
from app.services.database import Base

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    rol = Column(String, index=True)
    prioridad = Column(Integer, index=True)
