# app/routes/request.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime
from app.services.database import get_db
from app.models.request import Request
from app.models.user import User
from app.models.book import Book
from app.models.role import Role
from app.services.request_service import get_requests_pila, delete_request, find_request
from app.nodos.nodo import ListaPendientes

router = APIRouter(prefix="/requests", tags=["Requests"])

class RequestUpdate(BaseModel):
    estado: str

# Crear una solicitud
@router.post("/")
def create_request(user_id: int, book_id: int, db: Session = Depends(get_db)):
    
    # 1️⃣ Verificar que existan usuario y libro
    user = db.query(User.id.label("id_user"),User.nombre.label("nombre"),Role.id.label('id_rol'),Role.rol.label('rol'),
    Role.prioridad.label('prioridad')).join(Role, Role.id == User.role_id).filter(User.id == user_id).first()
    book = db.query(Book).filter(Book.id == book_id).first()

    ex_req = find_request(db, user_id, book_id)
    
    if not user:
        return {"error": "Usuario no encontrado"}
    if ex_req:
        return {"error": "Ya existe una solicitud anterior"}

    estado = "pendiente"

    # 2️⃣ Traer pila de solicitudes para este libro (ordenadas por prioridad y fecha)
    requests = get_requests_pila(db, book_id)
    
    # 3️⃣ Definir un estado en caso de que haya prestamos del libro
    if not requests:
        estado = "Prestado"
        # Creación de la solicitud
        new_request = Request(user_id=user_id, book_id=book_id, estado=estado)
        db.add(new_request)
        db.commit()
        db.refresh(new_request)

        return {
            "message": "Solicitud creada exitosamente",
            "request_id": new_request.id,
            "usuario": user.nombre,
            "rol": user.rol,
            "prioridad": user.prioridad,
        }
    else:
        estado = "pendiente"
        pendientes = ListaPendientes()

        # 4️⃣ Se oganizan los datos 
        for req in requests:
            if req.estado_libro == "pendiente":
                pendientes.append({
                    "id_request": req.id_request,
                    "id_user": req.id_user,
                    "id_rol": req.id_rol,
                    "prioridad": req.prioridad,
                    "id_book": req.id_book,
                    "titulo": req.titulo,
                    "estado_libro": req.estado_libro,
                })
                # 5️⃣ Se elimina cada linea pendiente para posterior cargue
                # reorganizados
                delete_request(db, req.id_request)

        # 6️⃣ Se añade al final de la lista la nueva solicitud
        pendientes.append({
            "id_request": 0,
            "id_user": user.id_user,
            "id_rol": user.id_rol,
            "prioridad": user.prioridad,
            "id_book": book_id,
            "titulo": book.titulo,
            "estado_libro": estado,
        })
        
        # 7️⃣ Se añade al final de la lista la nueva solicitud
        print("Orden Anterior")
        for pendiente in pendientes.recorrer_forward():
            print('-----------')
            print('id_request = ',pendiente['id_request'])
            print('id_user = ',pendiente['id_user'])
            print('id_rol = ',pendiente['id_rol'])
            print('prioridad = ',pendiente['prioridad'])
            print('id_book = ',pendiente['id_book'])
            print('titulo = ',pendiente['titulo'])
            print('estado_libro = ',pendiente['estado_libro'])
        
        # 8️⃣ Se reorganza la cola
        pendientes.sort_by_prioridad()

        # 9️⃣ Muestra del nuevo orden
        print("Orden nuevo")
        for pendiente in pendientes.recorrer_forward():
            print('-----------')
            print('id_request = ',pendiente['id_request'])
            print('id_user = ',pendiente['id_user'])
            print('id_rol = ',pendiente['id_rol'])
            print('prioridad = ',pendiente['prioridad'])
            print('id_book = ',pendiente['id_book'])
            print('titulo = ',pendiente['titulo'])
            print('estado_libro = ',pendiente['estado_libro'])

        # 1️⃣0️⃣ Reprganozación de las solicitudes para su registro
        for pendiente in pendientes.recorrer_forward():
            new_request = Request(user_id=pendiente['id_user'], book_id=pendiente['id_book'], estado=estado)
            db.add(new_request)
            db.commit()
            db.refresh(new_request)

        return {
            "message": "Solicitudes reorganizadas segun prioridad y orden de llegada",
        }
    

# Listar solicitudes
@router.get("/")
def list_requests(db: Session = Depends(get_db)):
    return db.query(Request).all()


# Cambiar BD segun la pila de una solicitud
@router.put("/{request_id}")
def update_request(request_id: int, update_data: RequestUpdate, db: Session = Depends(get_db)):
    request = db.query(Request).filter(Request.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")

    request.estado = update_data.estado 
    db.commit()
    db.refresh(request)

  
    return request

@router.delete("/{request_id}")
def destroy_request(request_id: int, db: Session = Depends(get_db)):
    return delete_request(db, request_id)

