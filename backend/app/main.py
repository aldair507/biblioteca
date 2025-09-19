from fastapi import FastAPI
from app.routes import user, book, request, role
from app.services.database import Base, engine

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Registrar rutas
app.include_router(user.router, prefix="/users", tags=["Users"])
app.include_router(book.router, prefix="/books", tags=["Books"])
app.include_router(request.router, prefix="/requests", tags=["Requests"])
app.include_router(role.router, prefix="/roles", tags=["Roles"])  # 👈 agregar roles también

@app.get("/")
def root():
    return {"message": "API de Biblioteca funcionando 🚀"}
