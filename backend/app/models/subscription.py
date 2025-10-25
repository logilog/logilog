from __future__ import annotations

from datetime import datetime, timedelta
from enum import Enum

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class SubscriptionPlan(str, Enum):
    TRIAL = "trial"
    PREMIUM = "premium"


class Subscription(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), unique=True)
    plan: Mapped[SubscriptionPlan] = mapped_column(SAEnum(SubscriptionPlan))
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    token_quota: Mapped[int] = mapped_column(Integer, default=100000)

    user: Mapped["User"] = relationship(back_populates="subscription")

    @classmethod
    def trial(cls, user_id: int, duration_days: int) -> "Subscription":
        start = datetime.utcnow()
        return cls(
            user_id=user_id,
            plan=SubscriptionPlan.TRIAL,
            started_at=start,
            expires_at=start + timedelta(days=duration_days),
            token_quota=20000,
        )
