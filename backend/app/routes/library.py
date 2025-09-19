from fastapi import APIRouter
from app.schemas.request import Solicitud
from app.services.library_service import Biblioteca

router = APIRouter()

# Instancia global (simulación en memoria)
biblioteca = Biblioteca()

@router.post("/solicitud")
def solicitar_libro(solicitud: Solicitud):
    return biblioteca.recibir_solicitud(
        nombre=solicitud.nombre,
        prioridad=solicitud.prioridad,
        libro=solicitud.libro
    )

@router.post("/agregar-libro")
def agregar_libro(libro: str):
    biblioteca.agregar_libro(libro)
    return {"mensaje": f"Libro '{libro}' agregado a la biblioteca"}

@router.get("/prestamos")
def obtener_prestamos():
    return {"prestamos": biblioteca.prestamos}

@router.get("/espera")
def obtener_espera():
    return {"espera": list(biblioteca.cola_espera)}
