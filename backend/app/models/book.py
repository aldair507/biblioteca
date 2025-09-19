from sqlalchemy import Column, Integer, String
from app.services.database import Base

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String, index=True)
    autor = Column(String, index=True)
    cantidad = Column(Integer, default=1)
