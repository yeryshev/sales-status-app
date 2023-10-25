from sqlalchemy.orm import Session
from src.db import models


def create_users(db: Session):
    user1 = models.User(
        username="eryshev",
        email="yeryshev@gmail.com",
        password="12345",
        first_name="Vadim",
        second_name="Eryshev",
        photo_url="https://ca.slack-edge.com/T04NDAULB7Z-U0532AH0PBL-0f4e7847a45c-512",
        ext_number="2005",
        telegram="eryshev",
        is_working_remotely=False,
        status_id=3,
    )

    user2 = models.User(
        username="alex",
        email="dergunow@gmail.com",
        password="12345",
        first_name="Alexey",
        second_name="Dergunov",
        photo_url="https://ca.slack-edge.com/T04NDAULB7Z-U053209CKEX-37c0e2aa5ffd-512",
        ext_number="2012",
        telegram="verceti",
        is_working_remotely=False,
        status_id=3,
    )

    users = [user1, user2]
    db.add_all(users)
    db.commit()
    db.refresh(user1)
    db.refresh(user2)
    return users
