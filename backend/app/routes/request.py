from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services.database import get_db
from app.models.request import Request
from app.models.user import User
from app.models.book import Book
from app.models.role import Role

router = APIRouter()

# Crear una solicitud
@router.post("/")
def create_request(user_id: int, book_id: int, db: Session = Depends(get_db)):
    # Verificar que existan usuario y libro
    user = db.query(User).filter(User.id == user_id).first()
    book = db.query(Book).filter(Book.id == book_id).first()
    rol = db.query(Role).filter(Role.id == user.role_id).first()

    
    if not user:
        return {"error": "Usuario no encontrado"}
    if book.cantidad < 1:
        return {"error": "No hay copias disponibles"}

    if rol.prioridad < 2:
      pass


    # Crear solicitud
    # request = Request(user_id=user_id, book_id=book_id)
    # db.add(request)
    # db.commit()
    # db.refresh(request)
    # return request

# Listar solicitudes
@router.get("/")
def list_requests(db: Session = Depends(get_db)):
    return db.query(Request).all()

# Cambiar estado de una solicitud
@router.put("/{request_id}")
def update_request(request_id: int, estado: str, db: Session = Depends(get_db)):
    request = db.query(Request).filter(Request.id == request_id).first()
    if not request:
        return {"error": "Solicitud no encontrada"}

    request.estado = estado

    # Si se aprueba, restar un libro disponible
    if estado == "aprobado":
        book = db.query(Book).filter(Book.id == request.book_id).first()
        if book and book.cantidad > 0:
            book.cantidad -= 1

    db.commit()
    db.refresh(request)
    return request


@router.get("/book/{book_id}")
def get_requests_pila(book_id: int, db: Session = Depends(get_db)):
    solicitudes = (
        db.query(Request)
        .join(User, Request.user_id == User.id)
        .join(Role, User.role_id == Role.id)
        .filter(Request.book_id == book_id)
        .order_by(Role.prioridad.asc(), Request.fecha_creacion.asc())
        .all()
    )

    pila = []
    for s in solicitudes:
        pila.append({
            "request_id": s.id,
            "user": s.user.nombre,
            "rol": s.user.role.rol,
            "prioridad": s.user.role.prioridad,
            "fecha": s.fecha_creacion
        })
