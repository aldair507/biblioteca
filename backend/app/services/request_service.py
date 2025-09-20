# app/services/request_service.py
from sqlalchemy.orm import Session
from app.models.request import Request
from app.models.user import User
from app.models.role import Role

def get_requests_pila(db: Session, book_id: int):
    requests = (
        db.query(Request)
        .join(User, User.id == Request.user_id)
        .join(Role, Role.id == User.role_id)
        .filter(Request.book_id == book_id)
        .order_by(Role.prioridad.asc(), Request.created_at.asc())
        .all()
    )
    return requests
