from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.auth.router import router as auth_router
from src.config import settings
from src.statuses.router import router as statuses_router
from src.users.router import users_router as users_router, telegram_router as telegram_router
from src.websockets.router import router as websocket_router

app = FastAPI(title='Team Status API')

origins = settings.FRONTEND_ORIGINS.split(',')

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS", "PUT", "DELETE", "PATCH"],
    allow_headers=["Access-Control-Allow-Origin", "Content-Type", "Authorization", "Accept", "Origin"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(websocket_router)
app.include_router(telegram_router)
app.include_router(statuses_router)
