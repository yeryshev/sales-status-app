from fastapi import APIRouter

from app.api.routes import auth, sso, status_analytics, statuses, users, websockets

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(sso.router, prefix="/auth", tags=["sso"])
api_router.include_router(users.users_router, prefix="/users", tags=["users"])
api_router.include_router(users.telegram_router, prefix="/telegram", tags=["telegram"])
api_router.include_router(
    users.fastapi_users_router, prefix="/fastapi-users", tags=["fastapi-users"]
)
api_router.include_router(statuses.router, prefix="/status", tags=["statuses"])
api_router.include_router(
    status_analytics.router,
    prefix="/admin/status-analytics",
    tags=["admin", "status-analytics"],
)
api_router.include_router(websockets.router)
