from sqlalchemy.orm import Session

from src.db import schemas
from src.db import models


def get_users(db: Session):
    return db.query(models.User).all()
