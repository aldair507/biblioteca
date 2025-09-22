from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import user, book, request, role
from app.services.database import Base, engine

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # o "*" si quieres permitir todo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar rutas
app.include_router(user.router, prefix="/users", tags=["Users"])
app.include_router(book.router, prefix="/books", tags=["Books"])
app.include_router(request.router, prefix="/requests", tags=["Requests"])
app.include_router(role.router, prefix="/roles", tags=["Roles"])

@app.get("/")
def root():
    return {"message": "API de Biblioteca funcionando 🚀"}
