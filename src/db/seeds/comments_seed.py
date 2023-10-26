from sqlalchemy.orm import Session
from src.db import models


def create_comments(db: Session):
    comment1 = models.Comment(
        description="Обед",
        owner_id=1
    )

    comment2 = models.Comment(
        description="На встрече с клиентом",
        owner_id=2
    )

    comment3 = models.Comment(
        description="Созвон",
        owner_id=1
    )

    comments = [comment1, comment2, comment3]
    db.add_all(comments)
    db.commit()
    db.refresh(comment1)
    db.refresh(comment2)
    db.refresh(comment3)
    return comments
