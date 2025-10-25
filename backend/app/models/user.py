from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum as SAEnum, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .subscription import Subscription


class UserStatusEnum(str, Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"


class User(Base):
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(255))
    hashed_password: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    status: Mapped[UserStatusEnum] = mapped_column(
        SAEnum(UserStatusEnum), default=UserStatusEnum.ACTIVE, nullable=False
    )

    subscription: Mapped[Subscription | None] = relationship(back_populates="user", uselist=False)
