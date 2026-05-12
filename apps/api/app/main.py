from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import get_db
from app.core.redis import close_redis
from app.data.seed_learning import seed_learning_data
from app.routers import assets, auth, charts, chat, learning, portfolio, watchlist

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    async for db in get_db():
        await seed_learning_data(db)
        break
    yield
    await close_redis()


app = FastAPI(
    title="TradePilot API",
    version="0.1.0",
    description="Backend für die TradePilot Trading- und Lernplattform.",
    lifespan=lifespan,
    docs_url="/docs" if settings.APP_ENV != "production" else None,
    redoc_url="/redoc" if settings.APP_ENV != "production" else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(assets.router)
app.include_router(charts.router)
app.include_router(portfolio.router)
app.include_router(watchlist.router)
app.include_router(learning.router)
app.include_router(chat.router)


@app.get("/health", tags=["system"])
async def health() -> dict:
    return {"status": "ok", "env": settings.APP_ENV}
