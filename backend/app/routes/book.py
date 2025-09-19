from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services.database import get_db
from app.models.book import Book

router = APIRouter()

# Crear un libro
@router.post("/")
def create_book(titulo: str, autor: str, cantidad: int = 1, db: Session = Depends(get_db)):
    book = Book(titulo=titulo, autor=autor, cantidad=cantidad)
    db.add(book)
    db.commit()
    db.refresh(book)
    return book

# Listar libros
@router.get("/")
def list_books(db: Session = Depends(get_db)):
    return db.query(Book).all()
