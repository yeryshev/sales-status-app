from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.db import crud, models
from src.db.database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def read_users(db: Session = Depends(get_db)):
    users = crud.get_users(db)
    return users
