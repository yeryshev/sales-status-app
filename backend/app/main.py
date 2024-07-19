from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.main import api_router
from backend.app.core.config import settings

app = FastAPI(title='Team Status API')

if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            str(origin).strip("/") for origin in settings.BACKEND_CORS_ORIGINS
        ],
        allow_credentials=True,
        allow_methods=["POST", "GET", "OPTIONS", "PUT", "DELETE", "PATCH"],
        allow_headers=["Access-Control-Allow-Origin", "Content-Type", "Authorization", "Accept", "Origin",
                       "sentry-trace", "baggage"])

app.include_router(api_router)
