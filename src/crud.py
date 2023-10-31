from sqlalchemy import select
from src.database import engine, async_session_factory, Base
from src.auth.models import User
from src.models import Status


class AsyncORM:
    @staticmethod
    async def create_tables():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)

    @staticmethod
    async def insert_users():
        async with async_session_factory() as session:
            vadim = User(
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
    async def update_user(user_id: int, **kwargs):
        async with async_session_factory() as session:
            user = await session.get(User, user_id)
            await session.refresh(user)

            for key, value in kwargs.items():
                setattr(user, key, value)

            await session.commit()
            return user

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
