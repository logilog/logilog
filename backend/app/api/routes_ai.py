from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from ..core.database import get_session
from ..models import Subscription, UsageLog, User
from ..services.openai_client import OpenAIClient, OpenAIServiceError, get_openai_client
from .deps import get_current_user

router = APIRouter(prefix="/ai", tags=["ai"])


class CompletionRequest(BaseModel):
    prompt: str = Field(min_length=1, max_length=4000)
    model: str = "gpt-4o-mini"
    max_tokens: int = Field(default=512, le=2048)


class CompletionResponse(BaseModel):
    content: str
    tokens_consumed: int


@router.post("/complete", response_model=CompletionResponse)
async def generate_completion(
    payload: CompletionRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
    client: OpenAIClient = Depends(get_openai_client),
) -> CompletionResponse:
    subscription = await session.scalar(select(Subscription).where(Subscription.user_id == current_user.id))
    if subscription is None:
        raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail="Subscription required")

    total_usage = await session.scalar(
        select(func.coalesce(func.sum(UsageLog.tokens_used), 0)).where(UsageLog.user_id == current_user.id)
    )
    if total_usage is None:
        total_usage = 0
    if total_usage >= subscription.token_quota:
        raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail="Token quota exceeded")

    try:
        content = await client.complete(payload.prompt, model=payload.model, max_tokens=payload.max_tokens)
    except OpenAIServiceError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc

    usage = UsageLog(user_id=current_user.id, tokens_used=payload.max_tokens)
    session.add(usage)
    await session.commit()
    return CompletionResponse(content=content, tokens_consumed=payload.max_tokens)
