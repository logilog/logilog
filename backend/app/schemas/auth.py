from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from ..models import SubscriptionPlan, UserStatusEnum


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=1, max_length=255)


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserRead(UserBase):
    id: int
    status: UserStatusEnum
    created_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class SubscriptionRead(BaseModel):
    plan: SubscriptionPlan
    started_at: datetime
    expires_at: datetime
    token_quota: int

    class Config:
        from_attributes = True


class MeResponse(BaseModel):
    user: UserRead
    subscription: SubscriptionRead | None
