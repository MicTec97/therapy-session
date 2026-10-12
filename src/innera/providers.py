"""Model seam. Swap the model with the OPENAI_MODEL environment variable."""

import os
from abc import ABC, abstractmethod
from typing import Any

from innera.content import FIXED_REPLY, SYSTEM_PROMPT

DEFAULT_MODEL = "gpt-6-luna"


class ModelProvider(ABC):
    @abstractmethod
    def complete(self, user_text: str) -> str:
        """Return the assistant reply for one user turn."""


class FixedReplyProvider(ModelProvider):
    def complete(self, user_text: str) -> str:
        return FIXED_REPLY


class OpenAIProvider(ModelProvider):
    def __init__(self, client: Any | None = None, model: str | None = None) -> None:
        self._client = client
        self.model = model or os.environ.get("OPENAI_MODEL", DEFAULT_MODEL)

    def complete(self, user_text: str) -> str:
        client = self._client if self._client is not None else self._default_client()
        response = client.chat.completions.create(
            model=self.model,
            reasoning_effort="none",
            max_completion_tokens=400,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_text},
            ],
        )
        content = response.choices[0].message.content
        return (content or "").strip()

    @staticmethod
    def _default_client() -> Any:
        from openai import OpenAI

        return OpenAI(timeout=30.0)
