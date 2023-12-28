import redis
from fastapi import APIRouter

router = APIRouter(prefix="/mango", tags=["Mango"])
r = redis.Redis(host='redis', decode_responses=True)


@router.get("/")
async def get_mango():
    return r.get('foo')


@router.get("/set")
async def set_mango():
    return r.set('foo', 'bar')
