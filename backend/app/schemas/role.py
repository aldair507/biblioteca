from pydantic import BaseModel

class RoleResponse(BaseModel):
    id: int
    rol: str
    prioridad: int

    class Config:
        from_attributes  = True
