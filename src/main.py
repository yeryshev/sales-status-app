from fastapi import FastAPI
from src.orm import AsyncORM


app = FastAPI(title='Team Status API')


@app.get("/users/")
async def get_users():
    return await AsyncORM.select_users()
