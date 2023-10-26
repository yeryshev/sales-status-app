from sqlalchemy.orm import Session
from src.db import models


def create_statuses(db: Session):
    status1 = models.Status(
        title="online"
    )

    status2 = models.Status(
        title="busy"
    )

    status3 = models.Status(
        title="offline"
    )

    statuses = [status1, status2, status3]
    db.add_all(statuses)
    db.commit()
    db.refresh(status1)
    db.refresh(status2)
    db.refresh(status3)
    return statuses
