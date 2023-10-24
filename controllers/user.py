from sqlalchemy.orm import Session
from model import user


def get_users(db: Session):
    return db.query(user.User).all()
