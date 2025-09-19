from pydantic import BaseModel, EmailStr
from app.schemas.role import RoleResponse

class UserBase(BaseModel):
    nombre: str
    email: EmailStr
    role_id: int   # Se envía el ID del rol

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    role: RoleResponse | None = None   # 👈 Para devolver el rol completo

    class Config:
        from_attributes = True
