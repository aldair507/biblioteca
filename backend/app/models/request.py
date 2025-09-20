from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.services.database import Base

class Request(Base):
    __tablename__ = "requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    book_id = Column(Integer, ForeignKey("books.id"))
    estado = Column(String, default="pendiente")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="requests")
    book = relationship("Book", backref="requests")
