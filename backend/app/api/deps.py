from datetime import datetime, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.config import settings
from ..core.database import get_session
from ..models import User

reuseable_oauth = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


async def get_current_user(
    token: str = Depends(reuseable_oauth), session: AsyncSession = Depends(get_session)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
        subject: str | None = payload.get("sub")
        exp = payload.get("exp")
        if subject is None or exp is None:
            raise credentials_exception
        if datetime.fromtimestamp(exp, tz=timezone.utc) < datetime.now(tz=timezone.utc):
            raise credentials_exception
    except JWTError as exc:  # pragma: no cover - cryptographic validation
        raise credentials_exception from exc

    result = await session.execute(select(User).where(User.id == int(subject)))
    user = result.scalar_one_or_none()
    if user is None:
        raise credentials_exception
    return user
