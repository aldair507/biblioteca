from app.services.database import SessionLocal
from app.models.book import Book

def run():
    db = SessionLocal()
    books = [
        {"titulo": "Cien años de soledad", "autor": "Gabriel García Márquez"},
        {"titulo": "El amor en los tiempos del cólera", "autor": "Gabriel García Márquez"},
        {"titulo": "La ciudad y los perros", "autor": "Mario Vargas Llosa"},
        {"titulo": "Pedro Páramo", "autor": "Juan Rulfo"},
        {"titulo": "Rayuela", "autor": "Julio Cortázar"},
    ]

    for book_data in books:
        new_book = Book(**book_data)
        db.add(new_book)

    db.commit()
    db.close()
    print("✅ Libros insertados correctamente")
