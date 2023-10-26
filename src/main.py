from fastapi import FastAPI
from src.db.database import engine, Base
from src.routers.user import router as user_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title='Team Status API')

app.include_router(user_router, prefix='/users')
