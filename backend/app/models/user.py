from sqlalchemy import Column, Integer, String, ForeignKey
from app.services.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    role_id = Column(Integer, ForeignKey("users.id"))