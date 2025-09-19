from pydantic import BaseModel

class Solicitud(BaseModel):
    nombre: str
    prioridad: bool = False
    libro: str
