from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.main import api_router
from app.core.config import settings

app = FastAPI(title='Team Status API')

origins = settings.FRONTEND_ORIGINS.split(',')

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS", "PUT", "DELETE", "PATCH"],
    allow_headers=["Access-Control-Allow-Origin", "Content-Type", "Authorization", "Accept", "Origin", "sentry-trace",
                   "baggage"]
)

app.include_router(api_router)
