from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.config import settings
from ..core.database import get_session
from ..models import Subscription, SubscriptionPlan, User
from ..schemas.auth import SubscriptionRead
from .deps import get_current_user

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])


@router.post("/trial", response_model=SubscriptionRead, status_code=status.HTTP_201_CREATED)
async def start_trial(
    current_user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)
) -> Subscription:
    existing = await session.scalar(select(Subscription).where(Subscription.user_id == current_user.id))
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Subscription already exists")

    subscription = Subscription.trial(current_user.id, settings.trial_length_days)
    session.add(subscription)
    await session.commit()
    await session.refresh(subscription)
    return subscription


@router.post("/activate", response_model=SubscriptionRead)
async def activate_premium(
    current_user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)
) -> Subscription:
    subscription = await session.scalar(select(Subscription).where(Subscription.user_id == current_user.id))
    if subscription is None:
        subscription = Subscription.trial(current_user.id, settings.trial_length_days)
        session.add(subscription)
    subscription.plan = SubscriptionPlan.PREMIUM
    subscription.started_at = datetime.utcnow()
    subscription.expires_at = datetime.utcnow()
    subscription.token_quota = 500000
    await session.commit()
    await session.refresh(subscription)
    return subscription
