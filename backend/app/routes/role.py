# app/routes/role.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services.database import get_db
from app.models.role import Role   # 👈 importar modelo real de BD
from app.schemas.role import RoleResponse

router = APIRouter()

# ========================
# 📌 Endpoints de Roles
# ========================

# Obtener todos los roles
@router.get("/", response_model=list[RoleResponse])
def get_roles(db: Session = Depends(get_db)):
    return db.query(Role).all()   # 👈 usar modelo de BD


# Crear un rol nuevo
@router.post("/", response_model=RoleResponse)
def create_role(role: RoleResponse, db: Session = Depends(get_db)):
    new_role = Role(rol=role.rol, prioridad=role.prioridad)  # 👈 usar modelo Role
    db.add(new_role)
    db.commit()
    db.refresh(new_role)
    return new_role


# Obtener un rol específico
@router.get("/{role_id}", response_model=RoleResponse)
def get_role(role_id: int, db: Session = Depends(get_db)):
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return role


# Actualizar un rol
@router.put("/{role_id}", response_model=RoleResponse)
def update_role(role_id: int, role_data: RoleResponse, db: Session = Depends(get_db)):
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Rol no encontrado")

    role.rol = role_data.rol
    role.prioridad = role_data.prioridad

    db.commit()
    db.refresh(role)
    return role


# Eliminar un rol
@router.delete("/{role_id}")
def delete_role(role_id: int, db: Session = Depends(get_db)):
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Rol no encontrado")

    db.delete(role)
    db.commit()
    return {"message": f"Rol con id {role_id} eliminado"}
