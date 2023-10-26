from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from src.db import crud, models, schemas
from src.db.database import SessionLocal, engine

# from src.db.seeds.users_seed import create_users
# from src.db.seeds.status_seed import create_statuses
# from src.db.seeds.comments_seed import create_comments

models.Base.metadata.create_all(bind=engine)
# create_users(SessionLocal())
# create_statuses(SessionLocal())
# create_comments(SessionLocal())

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[schemas.UserWithoutPassword])
def read_users(db: Session = Depends(get_db)):
    users = crud.get_users(db)
    return users
