from __future__ import annotations

from typing import Any

import httpx

from ..core.config import settings


class OpenAIServiceError(RuntimeError):
    """Raised when the OpenAI API returns an unexpected response."""


class OpenAIClient:
    base_url = "https://api.openai.com/v1"

    async def complete(self, prompt: str, *, model: str = "gpt-4o-mini", max_tokens: int = 512) -> str:
        if settings.openai_api_key is None:
            raise OpenAIServiceError("OpenAI API key is not configured.")

        headers = {
            "Authorization": f"Bearer {settings.openai_api_key}",
            "Content-Type": "application/json",
        }
        payload: dict[str, Any] = {
            "model": model,
            "messages": [
                {"role": "system", "content": "You are LogiLog's AI assistant."},
                {"role": "user", "content": prompt},
            ],
            "max_tokens": max_tokens,
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(f"{self.base_url}/chat/completions", headers=headers, json=payload)

        if response.status_code >= 400:
            raise OpenAIServiceError(f"OpenAI API error: {response.status_code} {response.text}")

        data = response.json()
        try:
            return data["choices"][0]["message"]["content"]
        except (KeyError, IndexError) as exc:  # pragma: no cover - defensive
            raise OpenAIServiceError("Malformed response from OpenAI API") from exc


def get_openai_client() -> OpenAIClient:
    return OpenAIClient()
