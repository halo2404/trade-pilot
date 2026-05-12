from unittest.mock import AsyncMock, MagicMock

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.core.database import Base, get_db
from app.main import app

TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"

engine = create_async_engine(TEST_DATABASE_URL, echo=False)
TestSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


async def override_get_db():
    async with TestSessionLocal() as session:
        yield session


app.dependency_overrides[get_db] = override_get_db

# Mock Redis so tests don't need a running Redis instance
_mock_redis = MagicMock()
_mock_redis.incr = AsyncMock(return_value=1)
_mock_redis.expire = AsyncMock(return_value=True)
_mock_redis.exists = AsyncMock(return_value=0)
_mock_redis.setex = AsyncMock(return_value=True)
_mock_redis.aclose = AsyncMock(return_value=None)


@pytest.fixture(autouse=True)
def mock_redis(monkeypatch):
    monkeypatch.setattr("app.core.redis._redis", _mock_redis)
    monkeypatch.setattr("app.core.redis.get_redis", lambda: _mock_redis)
    monkeypatch.setattr("app.routers.auth.get_redis", lambda: _mock_redis)


@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c
