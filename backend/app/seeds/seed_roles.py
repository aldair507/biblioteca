from app.models.role import Role
from app.services.database import SessionLocal

def run():
    db = SessionLocal()

    roles = [
        {"rol": "Administrador", "prioridad": 1},
        {"rol": "Coordinador",   "prioridad": 2},
        {"rol": "Docente",       "prioridad": 3},
        {"rol": "Estudiante",    "prioridad": 4},
    ]

    for r in roles:
        exists = db.query(Role).filter_by(rol=r["rol"]).first()
        if not exists:
            new_role = Role(**r)
            db.add(new_role)

    db.commit()
    db.close()
    print("✅ Roles insertados correctamente.")
