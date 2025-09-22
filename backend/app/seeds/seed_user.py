from app.models.user import User
from app.services.database import SessionLocal

def run():
    db = SessionLocal()

    users = [
        {"nombre": "Santiago", "email": "santiago@example.com", "role_id": 1},
        {"nombre": "A", "email": "a@example.com", "role_id": 2},
        {"nombre": "B", "email": "b@example.com", "role_id": 3},
        {"nombre": "C", "email": "c@example.com", "role_id": 4},
        {"nombre": "D", "email": "d@example.com", "role_id": 4},
    ]

    for u in users:
        exists = db.query(User).filter_by(email=u["email"]).first()
        if not exists:
            new_user = User(**u)
            db.add(new_user)

    db.commit()
    db.close()
    print("✅ Usuarios insertados correctamente.")
