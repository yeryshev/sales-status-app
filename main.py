from fastapi import FastAPI
from model.database import engine, Base
from routers.user import router as user_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(user_router, prefix='/users')
