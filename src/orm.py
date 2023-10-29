from sqlalchemy import select
from src.database import async_engine, async_session_factory, Base
from src.models import User, Status


class AsyncORM:
    @staticmethod
    async def create_tables():
        async with async_engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)

    @staticmethod
    async def insert_users():
        async with async_session_factory() as session:
            vadim = User(
                username="eryshev",
                email="yeryshev@gmail.com",
                hashed_password="12345",
                first_name="Vadim",
                second_name="Eryshev",
                photo_url="https://ca.slack-edge.com/T04NDAULB7Z-U0532AH0PBL-0f4e7847a45c-512",
                ext_number="2005",
                telegram="eryshev",
                status_id=3,
            )
            alex = User(
                username="alex",
                email="dergunow@gmail.com",
                hashed_password="12345",
                first_name="Alex",
                second_name="Dergunov",
                photo_url="https://ca.slack-edge.com/T04NDAULB7Z-U053209CKEX-37c0e2aa5ffd-512",
                ext_number="2012",
                telegram="verceti",
                status_id=3,
            )
            session.add_all([vadim, alex])
            await session.flush()
            await session.commit()

    @staticmethod
    async def select_users():
        async with async_session_factory() as session:
            query = select(User)
            result = await session.execute(query)
            users = result.scalars().all()
            print(f"{users=}")
            return users

    @staticmethod
    async def update_user(user_id: int = 2, new_username: str = "alexey"):
        async with async_session_factory() as session:
            user = await session.get(User, user_id)
            user.username = new_username
            await session.refresh(user)
            await session.commit()

    @staticmethod
    async def insert_statuses():
        async with async_session_factory() as session:
            status_1 = Status(title="online")
            status_2 = Status(title="busy")
            status_3 = Status(title="offline")
            session.add_all([status_1, status_2, status_3])
            await session.commit()

    @staticmethod
    async def select_statuses():
        async with async_session_factory() as session:
            query = select(Status)
            result = await session.execute(query)
            statuses = result.scalars().all()
            print(f"{statuses=}")
            return statuses
