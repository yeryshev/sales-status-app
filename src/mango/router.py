import redis
from fastapi import APIRouter

router = APIRouter(prefix="/mango", tags=["Mango"])
# r = redis.Redis(host='redis', decode_responses=True)
#
#
# @router.get("/")
# async def get_mango(key: str):
#     return r.get(key)
#
#
# @router.post("/")
# async def set_mango(key: str, value: str):
#     return r.set(key, value)
