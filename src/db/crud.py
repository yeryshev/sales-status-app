from sqlalchemy.orm import Session

from src.db import schemas
from src.db import models


def get_users(db: Session):
    return db.query(models.User).order_by(models.User.status_id).all()


def update_user(db: Session, user_id: int, user):
    db_user = db.query(models.User).get(user_id)
    db_user.username = user.username
    db_user.email = user.email
    db_user.first_name = user.first_name
    db_user.second_name = user.second_name
    db_user.photo_url = user.photo_url
    db_user.ext_number = user.ext_number
    db_user.telegram = user.telegram
    db_user.is_working_remotely = user.is_working_remotely
    db_user.status_id = user.status_id
    db_user.comment_id = user.comment_id
    db.commit()
    db.refresh(db_user)
    return db_user
