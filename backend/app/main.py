import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.main import api_router
from app.core.config import settings

if settings.SENTRY_DSN and settings.ENVIRONMENT != "local":
    sentry_sdk.init(
        dsn=str(settings.SENTRY_DSN),
        traces_sample_rate=0.1,
        profiles_sample_rate=0.1,
        enable_tracing=True,
    )

app = FastAPI(title="Team Status API")

if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            str(origin).strip("/") for origin in settings.BACKEND_CORS_ORIGINS
        ],
        allow_credentials=True,
        allow_methods=["POST", "GET", "OPTIONS", "PUT", "DELETE", "PATCH"],
        allow_headers=[
            "Access-Control-Allow-Origin",
            "Content-Type",
            "Authorization",
            "Accept",
            "Origin",
            "sentry-trace",
            "baggage",
        ],
    )

app.include_router(api_router)
