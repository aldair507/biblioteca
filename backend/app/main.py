from fastapi import FastAPI
from app.routes import user, book, request
from app.services.database import Base, engine
import app.models  # 👈 Importa todos los modelos

# Crear tablas
Base.metadata.create_all(bind=engine)


app = FastAPI()

app.include_router(user.router)

# Registrar rutas
app.include_router(user.router, prefix="/users", tags=["Users"])
app.include_router(book.router, prefix="/books", tags=["Books"])
app.include_router(request.router, prefix="/requests", tags=["Requests"])

@app.get("/")
def root():
    return {"message": "API de Biblioteca funcionando 🚀"}
