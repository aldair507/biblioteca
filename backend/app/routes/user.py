from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from app.services.database import get_db
from app.models.user import User
from app.models.role import Role
from app.schemas.user import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Verificar que el rol existe
    role = db.query(Role).filter(Role.id == user.role_id).first()
    if not role:
        raise HTTPException(status_code=400, detail=f"Rol con id={user.role_id} no existe")

    # Crear usuario
    db_user = User(
        nombre=user.nombre,
        email=user.email,
        role_id=role.id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.get("/", response_model=list[UserResponse])
def list_users(db: Session = Depends(get_db)):
    # joinedload permite traer también el rol asociado
    users = db.query(User).options(joinedload(User.role)).all()
    return users
