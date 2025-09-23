# app/services/request_service.py
from sqlalchemy.orm import Session
from app.models.request import Request
from app.models.user import User
from app.models.role import Role
from app.models.book import Book

def get_requests_pila(db: Session, book_id: int):
    requests = (
        db.query(Request.id.label('id_request'),User.id.label("id_user"),
                Role.id.label('id_rol'),Role.prioridad.label('prioridad'),
                Book.id.label('id_book'),Book.titulo.label('titulo'),Request.estado.label('estado_libro')
                )
        .join(User, User.id == Request.user_id)
        .join(Role, Role.id == User.role_id)
        .join(Book, Request.book_id == Book.id)
        .filter(Request.book_id == book_id)
        .order_by(Role.prioridad.asc(), Request.created_at.asc())
        .all()
    )
    return requests

def find_request(db: Session, user_id: int, book_id: int):
    req = db.query(Request).filter(Request.user_id == user_id, Request.book_id == book_id, Request.estado.in_(['Prestado', 'pendiente'])).first()
    return req

def delete_request(db: Session, request_id: int):
    req = db.query(Request).filter(Request.id == request_id).first()
    if req:
        db.delete(req)   # Marca el objeto para eliminarlo
        db.commit()      # Confirma en la base de datos
        return {"msg": "Request eliminada"}
    return {"error": "Request no encontrada"}

