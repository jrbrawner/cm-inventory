from fastapi import FastAPI
from api.db.session import Base, engine

from api.routers import hello_world

app = FastAPI()

app.include_router(hello_world.router)


@app.on_event("startup")
async def startup():
    # create db tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
