from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_session
from ..models import Subscription, User
from ..schemas.auth import MeResponse, SubscriptionRead, UserRead
from .deps import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=MeResponse)
async def read_me(
    current_user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)
) -> MeResponse:
    subscription = None
    if current_user.subscription:
        subscription = SubscriptionRead.model_validate(current_user.subscription)
    else:
        result = await session.scalar(select(Subscription).where(Subscription.user_id == current_user.id))
        if result:
            subscription = SubscriptionRead.model_validate(result)
    return MeResponse(user=UserRead.model_validate(current_user), subscription=subscription)
