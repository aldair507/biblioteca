# app/routes/request.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.services.database import get_db
from app.models.request import Request
from app.models.user import User
from app.models.book import Book
from app.models.role import Role
from app.services.request_service import get_requests_pila

router = APIRouter(prefix="/requests", tags=["Requests"])


# Crear una solicitud
@router.post("/")
def create_request(user_id: int, book_id: int, db: Session = Depends(get_db)):
    # 1️⃣ Verificar que existan usuario y libro
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "Usuario no encontrado"}

    book = db.query(Book).filter(Book.id == book_id).first()

    if book.cantidad < 1:
        return {"error": "No hay copias disponibles"}

    role = db.query(Role).filter(Role.id == user.role_id).first()

    # 2️⃣ Traer pila de solicitudes para este libro (ordenadas por prioridad y fecha)
    requests = get_requests_pila(db, book_id)

    # 3️⃣ Validar prioridad frente a los que ya están en la pila
    # for req in requests:
    #     r_user = db.query(User).filter(User.id == req.user_id).first()
    #     r_role = db.query(Role).filter(Role.id == r_user.role_id).first()
        
    #     if role.prioridad > r_role.prioridad:
    #         return {
    #             "error": "Un usuario con mayor prioridad ya está en la fila",
    #             "usuario": r_user.nombre,
    #             "rol": r_role.rol
    #         }

    # 4️⃣ Si pasó las validaciones, ahora sí crear la solicitud
    new_request = Request(user_id=user_id, book_id=book_id, estado="pendiente")
    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    # 5️⃣ Recalcular pila para obtener posición final
    requests = get_requests_pila(db, book_id)
    posicion = next(
        (i + 1 for i, r in enumerate(requests) if r.id == new_request.id),
        None
    )

    return {
        "message": "Solicitud creada exitosamente",
        "request_id": new_request.id,
        "usuario": user.nombre,
        "rol": role.rol,
        "prioridad": role.prioridad,
        "posicion_en_pila": posicion
    }


# Listar solicitudes
@router.get("/")
def list_requests(db: Session = Depends(get_db)):
    return db.query(Request).all()


# Cambiar BD segun la pila de una solicitud
@router.put("/{request_id}")
def update_request(request_id: int, db: Session = Depends(get_db)):
    request = db.query(Request).filter(Request.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")

    db.commit()
    db.refresh(request)
    return request
