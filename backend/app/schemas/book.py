from pydantic import BaseModel

class BookRequest(BaseModel):
    titulo: str
