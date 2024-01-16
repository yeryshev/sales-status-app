from fastapi import FastAPI

from config import FRONTEND_ORIGIN
from src.users.router import router as users_router
from src.auth.router import router as auth_router
from src.comments.router import router as comments_router
from src.websockets.router import router as websocket_router
from fastapi.middleware.cors import CORSMiddleware
from src.mango.router import router as mango_router


app = FastAPI(title='Team Status API')

origins = [FRONTEND_ORIGIN]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS", "PUT", "DELETE", "PATCH"],
    allow_headers=["Access-Control-Allow-Origin", "Content-Type", "Authorization", "Accept", "Origin"],
)


app.include_router(auth_router)
app.include_router(users_router)
app.include_router(comments_router)
app.include_router(websocket_router)
app.include_router(mango_router)
