from sqlalchemy.orm import Session
from src.db.models import user


def get_users(db: Session):
    return db.query(user.User).all()
