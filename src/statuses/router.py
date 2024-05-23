from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.base_config import current_user, current_superuser
from src.database import get_async_session
from .models import Status
from .schemas import StatusOut, StatusIn, StatusUpdate
from .service import add_status_to_db, delete_status_from_db, get_statuses

router = APIRouter(prefix="/status", tags=["Statuses"])


@router.get("/", response_model=list[StatusOut], dependencies=[Depends(current_user)])
async def get_all_statuses(session: AsyncSession = Depends(get_async_session)):
    try:
        return await get_statuses(session)
    except Exception:
        raise HTTPException(status_code=404, detail="Statuses not found")


@router.post("/", response_model=StatusOut, dependencies=[Depends(current_superuser)])
async def create_status(
        status: StatusIn,
        session: AsyncSession = Depends(get_async_session),
):
    try:
        new_status = Status(title=status.title)
        return await add_status_to_db(status=new_status, session=session)
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail="Could not create status")


@router.put("/{status_id}", response_model=StatusOut, dependencies=[Depends(current_superuser)])
async def update_status(
        new_status: StatusUpdate,
        session: AsyncSession = Depends(get_async_session)):
    try:
        db_status = await session.get(Status, new_status.id)
        if not db_status:
            raise HTTPException(status_code=404, detail="Status not found")

        db_status.title = new_status.title
        await session.commit()
        return db_status
    except Exception:
        raise HTTPException(status_code=500, detail="Could not update status")


@router.delete("/{status_id}", response_model=StatusOut, dependencies=[Depends(current_superuser)])
async def delete_comment(
        status_id: int,
        session: AsyncSession = Depends(get_async_session)):
    try:
        status = await session.get(Status, status_id)
        if not status:
            raise HTTPException(status_code=404, detail="Status not found")
        return await delete_status_from_db(status, session)
    except Exception:
        raise HTTPException(status_code=500, detail="Could not delete status")
