from fastapi import FastAPI
from app.api.v1.routers import router
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db_setup import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(router, prefix="/v1", tags=["v1"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
