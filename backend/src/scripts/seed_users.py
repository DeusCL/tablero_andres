"""
Este script ayuda a crear un nuevo usuario admin.

Comando:
    python3 -m src.scripts.seed_users

"""

from src.infrastructure.database.models import User
from src.infrastructure.database.session import get_sync_db_session
from src.modules.auth.features.authentication.utils import hash_password



def main() -> None:
    print("Creando nuevo usuario.\n")

    username: str = input("username: ")
    password: str = input("password: ")

    with get_sync_db_session() as db:
        existing_user: User | None = db.query(User).filter(User.username == username).first()

        if existing_user:
            print(f"[INFO] Ya existe un usuario con el username '{username}'.")
            return

        password_hash: str = hash_password(password)

        db.add(
            User(
                username=username,
                password_hash=password_hash,
            )
        )

        db.commit()

    print(f"[SUCCESS] Usuario '{username}' creado exitosamente.")


if __name__ == "__main__":
    main()
