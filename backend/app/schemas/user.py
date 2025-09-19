from pydantic import BaseModel, EmailStr
from enum import Enum

class UserRole(str, Enum):
    Administrador = "Administrador"
    Coordinador = "Coordinador"
    Docente = "Docente"
    Estudiante = "Estudiante"
    Secretaria = "Secretaría"
    Finanzas = "Finanzas"

class UserBase(BaseModel):
    nombre: str
    email: EmailStr
    role: UserRole

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes  = True
