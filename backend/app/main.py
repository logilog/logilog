from fastapi import FastAPI

from .api import routes_ai, routes_auth, routes_subscriptions, routes_users
from .core.config import settings
from .models import Base
from .core.database import engine


async def init_models() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


app = FastAPI(title=settings.app_name, version="0.1.0", docs_url="/docs")


@app.on_event("startup")
async def on_startup() -> None:
    await init_models()


app.include_router(routes_auth.router, prefix="/api")
app.include_router(routes_users.router, prefix="/api")
app.include_router(routes_subscriptions.router, prefix="/api")
app.include_router(routes_ai.router, prefix="/api")
