from app.services.database import SessionLocal
from app.models.book import Book

def run():
    db = SessionLocal()
    books = [
        {"titulo": "Cien años de soledad", "autor": "Gabriel García Márquez", "cantidad": 3},
        {"titulo": "El amor en los tiempos del cólera", "autor": "Gabriel García Márquez", "cantidad": 2},
        {"titulo": "La ciudad y los perros", "autor": "Mario Vargas Llosa", "cantidad": 4},
        {"titulo": "Pedro Páramo", "autor": "Juan Rulfo", "cantidad": 1},
        {"titulo": "Rayuela", "autor": "Julio Cortázar", "cantidad": 5},
    ]

    for book_data in books:
        new_book = Book(**book_data)
        db.add(new_book)

    db.commit()
    db.close()
    print("✅ Libros insertados correctamente")
