from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.auth_config import current_superuser
from app.core.db import get_async_session
from app.crud import add_status_to_db, delete_status_from_db, get_statuses
from app.models import Status
from app.schemas import StatusCreate, StatusGet, StatusUpdate

router = APIRouter()


@router.get("/", response_model=list[StatusGet])
async def get_all_statuses(session: AsyncSession = Depends(get_async_session)):
    try:
        return await get_statuses(session)
    except Exception:
        raise HTTPException(status_code=404, detail="Statuses not found")


@router.get("/{status_id}", response_model=StatusGet)
async def get_status_by_id(
    status_id: int, session: AsyncSession = Depends(get_async_session)
):
    try:
        status = await session.get(Status, status_id)

        if status is None:
            raise HTTPException(status_code=404, detail="Status not found")

        return status

    except Exception:
        raise HTTPException(status_code=500, detail="An unknown error occurred")


@router.post("/", response_model=StatusGet, dependencies=[Depends(current_superuser)])
async def create_status(
    status: StatusCreate,
    session: AsyncSession = Depends(get_async_session),
):
    try:
        new_status = Status(title=status.title)
        return await add_status_to_db(status=new_status, session=session)
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail="Could not create status")


@router.put(
    "/{status_id}", response_model=StatusGet, dependencies=[Depends(current_superuser)]
)
async def update_status(
    new_status: StatusUpdate, session: AsyncSession = Depends(get_async_session)
):
    try:
        db_status = await session.get(Status, new_status.id)
        if not db_status:
            raise HTTPException(status_code=404, detail="Status not found")

        db_status.title = new_status.title
        await session.commit()
        await session.refresh(db_status)
        return db_status
    except Exception:
        raise HTTPException(status_code=500, detail="Could not update status")


@router.delete(
    "/{status_id}", response_model=StatusGet, dependencies=[Depends(current_superuser)]
)
async def delete_status(
    status_id: int, session: AsyncSession = Depends(get_async_session)
):
    try:
        status = await session.get(Status, status_id)
        if not status:
            raise HTTPException(status_code=404, detail="Status not found")
        return await delete_status_from_db(status, session)
    except Exception:
        raise HTTPException(status_code=500, detail="Could not delete status")
