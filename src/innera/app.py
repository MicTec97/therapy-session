"""Local INNERA app. Chat replies come from the configured model provider."""

import asyncio
import logging
import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from pathlib import Path

from starlette.applications import Starlette
from starlette.requests import Request
from starlette.responses import FileResponse, JSONResponse, Response
from starlette.routing import Mount, Route
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates

from innera.content import (
    CHECKUP_EFFORT,
    CHECKUP_MOODS,
    GOAL_AREAS,
    INSIGHT_LINE,
    SESSION_CLOSING,
    SESSION_MINUTES,
    SESSION_OPENING,
)
from innera.providers import FixedReplyProvider, ModelProvider, OpenAIProvider

logger = logging.getLogger(__name__)

PACKAGE_DIR = Path(__file__).resolve().parent
ROOT_DIR = PACKAGE_DIR.parents[1]
templates = Jinja2Templates(directory=str(PACKAGE_DIR / "templates"))
provider: ModelProvider = FixedReplyProvider()


def load_env() -> None:
    path = ROOT_DIR / ".env"
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        key, value = stripped.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"'))


def install_provider() -> ModelProvider:
    load_env()
    if os.environ.get("INNERA_PROVIDER") == "fixed" or not os.environ.get("OPENAI_API_KEY"):
        return FixedReplyProvider()
    return OpenAIProvider()


def _prompt(text: str, goals: object, history: object = None) -> str:
    parts: list[str] = []
    if isinstance(goals, list):
        lines: list[str] = []
        for goal in goals:
            if not isinstance(goal, dict):
                continue
            area = str(goal.get("area", "")).strip()
            detail = str(goal.get("text", "")).strip()
            if area or detail:
                lines.append(f"{area}: {detail}".strip(": "))
        if lines:
            parts.append("Ziele: " + "; ".join(lines))
    if isinstance(history, list):
        turns: list[str] = []
        for item in history[-12:]:
            if not isinstance(item, dict):
                continue
            spoken = str(item.get("text", "")).strip()[:2000]
            if not spoken:
                continue
            speaker = "Person" if item.get("role") == "user" else "INNERA"
            turns.append(f"{speaker}: {spoken}")
        if turns:
            parts.append("Bisheriges Gespräch:\n" + "\n".join(turns))
    parts.append(text[:4000])
    return "\n\n".join(parts)


async def chat(request: Request) -> Response:
    return templates.TemplateResponse(
        request,
        "chat.html",
        {
            "title": "Gesprächsraum",
            "active": "chat",
            "areas": GOAL_AREAS,
            "opening": SESSION_OPENING,
            "closing": SESSION_CLOSING,
            "minutes": SESSION_MINUTES,
        },
    )


async def ziele(request: Request) -> Response:
    return templates.TemplateResponse(
        request,
        "ziele.html",
        {"title": "Ziele", "active": "ziele", "areas": GOAL_AREAS},
    )


async def einblicke(request: Request) -> Response:
    return templates.TemplateResponse(
        request,
        "einblicke.html",
        {
            "title": "Einblicke",
            "active": "einblicke",
            "areas": GOAL_AREAS,
            "line": INSIGHT_LINE,
        },
    )


async def heute(request: Request) -> Response:
    return templates.TemplateResponse(
        request,
        "heute.html",
        {
            "title": "Heute",
            "active": "heute",
            "moods": CHECKUP_MOODS,
            "efforts": CHECKUP_EFFORT,
        },
    )


async def reply(request: Request) -> Response:
    try:
        payload = await request.json()
    except Exception:
        return JSONResponse({"reply": ""}, status_code=400)
    if not isinstance(payload, dict):
        return JSONResponse({"reply": ""}, status_code=400)
    text = str(payload.get("text", "")).strip()
    if not text:
        return JSONResponse({"reply": ""}, status_code=400)
    prompt = _prompt(text, payload.get("goals"), payload.get("history"))
    try:
        answer = await asyncio.to_thread(provider.complete, prompt)
    except Exception as error:
        logger.warning("model reply failed: %s", type(error).__name__)
        answer = "Ich konnte gerade nicht antworten. Versuch es noch einmal."
    return JSONResponse({"reply": answer})


@asynccontextmanager
async def lifespan(_app: Starlette) -> AsyncIterator[None]:
    global provider
    provider = install_provider()
    yield


async def manifest(request: Request) -> Response:
    return FileResponse(
        PACKAGE_DIR / "static" / "manifest.webmanifest",
        media_type="application/manifest+json",
    )


app = Starlette(
    routes=[
        Route("/", chat),
        Route("/ziele", ziele),
        Route("/einblicke", einblicke),
        Route("/heute", heute),
        Route("/api/reply", reply, methods=["POST"]),
        Route("/manifest.webmanifest", manifest),
        Mount("/static", StaticFiles(directory=str(PACKAGE_DIR / "static")), name="static"),
    ],
    lifespan=lifespan,
)


def main() -> None:
    import uvicorn

    uvicorn.run("innera.app:app", host="127.0.0.1", port=8000)
