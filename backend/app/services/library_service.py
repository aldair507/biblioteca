from collections import deque
from app.models.user import Usuario

class Biblioteca:
    def __init__(self, max_libros=5):
        self.libros_disponibles = []
        self.cola_espera = deque()
        self.prestamos = []
        self.max_libros = max_libros

    def agregar_libro(self, libro: str):
        self.libros_disponibles.append(libro)

    def recibir_solicitud(self, nombre: str, prioridad: bool, libro: str):
        usuario = Usuario(nombre, prioridad)
        if libro in self.libros_disponibles:
            if usuario.prioridad:
                self.cola_espera.appendleft((usuario, libro))
            else:
                self.cola_espera.append((usuario, libro))
        else:
            if usuario.prioridad:
                self.cola_espera.appendleft((usuario, libro))
            else:
                self.cola_espera.append((usuario, libro))

        self.asignar_libros()
        return {"prestamos": self.prestamos, "espera": list(self.cola_espera)}

    def asignar_libros(self):
        while (self.libros_disponibles 
               and self.cola_espera 
               and len(self.prestamos) < self.max_libros):
            usuario, libro = self.cola_espera.popleft()
            if libro in self.libros_disponibles:
                self.libros_disponibles.remove(libro)
                self.prestamos.append((usuario.nombre, libro))
            else:
                self.cola_espera.append((usuario, libro))
                break
