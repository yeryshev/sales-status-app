import sentry_sdk
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.main import api_router
from app.core.config import settings
from app.tasks import end_of_workday_job

if settings.SENTRY_DSN and settings.ENVIRONMENT != "local":
    sentry_sdk.init(
        dsn=str(settings.SENTRY_DSN),
        traces_sample_rate=0.1,
        profiles_sample_rate=0.1,
        enable_tracing=True,
        # Analytics POST bodies are tiny; avoid capturing large response payloads in traces.
        max_request_body_size="never",
    )

app = FastAPI(title="Team Status API")
scheduler = AsyncIOScheduler()

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
            "X-Requested-With",
            "Cache-Control",
        ],
    )

app.include_router(api_router)


@app.on_event("startup")
async def startup_event():
    scheduler.add_job(
        end_of_workday_job,
        CronTrigger(hour=16, minute=0, second=0, timezone="UTC"),
        max_instances=1,
        coalesce=True,
    )
    scheduler.start()


@app.on_event("shutdown")
async def shutdown_event():
    scheduler.shutdown()
