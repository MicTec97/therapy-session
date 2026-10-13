"""Local INNERA app. Chat replies come from the configured model provider."""

import asyncio
import logging
import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from pathlib import Path

from starlette.applications import Starlette
from starlette.requests import Request
from starlette.responses import FileResponse, JSONResponse, RedirectResponse, Response
from starlette.routing import Mount, Route
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates

from innera.content import (
    BODY_STEPS,
    CHECKUP_MOODS,
    CHECKUP_REPLIES,
    EXERCISES,
    GOAL_AREAS,
    GOAL_FREQUENCIES,
    IMPULSES,
    JOURNAL_PROMPTS,
    QUESTIONS,
    SESSION_OPENING,
    crisis_reply,
    home_metrics,
    insight_metrics,
    metric_by_slug,
    metric_view,
    question_for,
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


def provider_note() -> str:
    if isinstance(provider, FixedReplyProvider):
        return (
            "In dieser Sitzung antwortet ein lokaler Demo-Text. "
            "Es besteht keine Verbindung zu einem KI-Dienst."
        )
    model = getattr(provider, "model", "einem austauschbaren Modell")
    return (
        f"Antworten kommen über einen KI-Dienst. Das Modell ist {model} und lässt sich "
        "über OPENAI_MODEL wechseln. Der Schlüssel bleibt auf dem Server."
    )


def _prompt(text: str, goals: object, history: object = None) -> str:
    parts: list[str] = []
    if isinstance(goals, list):
        lines: list[str] = []
        for goal in goals:
            if not isinstance(goal, dict):
                continue
            area = str(goal.get("area", "")).strip()
            detail = str(goal.get("text") or goal.get("title") or "").strip()
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


def _page(request: Request, name: str, title: str, active: str, **extra: object) -> Response:
    context: dict[str, object] = {
        "title": title,
        "active": active,
        "provider_note": provider_note(),
        "question": question_for(),
    }
    context.update(extra)
    return templates.TemplateResponse(request, name, context)


async def start(request: Request) -> Response:
    return _page(
        request,
        "start.html",
        "Start",
        "start",
        metrics=home_metrics(),
        moods=CHECKUP_MOODS,
        replies=CHECKUP_REPLIES,
    )


async def chat(request: Request) -> Response:
    return _page(
        request,
        "chat.html",
        "Gespräch",
        "gespraech",
        opening=SESSION_OPENING,
        impulses=IMPULSES,
    )


async def ziele(request: Request) -> Response:
    return _page(
        request,
        "ziele.html",
        "Ziele",
        "ziele",
        areas=GOAL_AREAS,
        frequencies=GOAL_FREQUENCIES,
    )


async def einblicke(request: Request) -> Response:
    return _page(
        request,
        "einblicke.html",
        "Einblicke",
        "einblicke",
        metrics=insight_metrics(30),
    )


async def einblick_detail(request: Request) -> Response:
    metric = metric_by_slug(request.path_params["slug"])
    if metric is None:
        return Response("Nicht gefunden", status_code=404)
    return _page(
        request,
        "einblick.html",
        metric.title,
        "einblicke",
        metric=metric_view(metric, 30, chart=True),
        moods=CHECKUP_MOODS,
    )


async def tagebuch(request: Request) -> Response:
    return _page(request, "tagebuch.html", "Tagebuch", "tagebuch", prompts=JOURNAL_PROMPTS)


async def profil(request: Request) -> Response:
    return _page(request, "profil.html", "Profil", "profil")


async def moment(request: Request) -> Response:
    return _page(request, "moment.html", "Ein Moment für dich", "start", exercises=EXERCISES)


async def uebung(request: Request) -> Response:
    slug = request.path_params["slug"]
    exercise = next((item for item in EXERCISES if item["slug"] == slug), None)
    if exercise is None:
        return Response("Nicht gefunden", status_code=404)
    return _page(
        request,
        "uebung.html",
        exercise["title"],
        "start",
        exercise=exercise,
        steps=BODY_STEPS,
    )


async def woche(request: Request) -> Response:
    return _page(request, "woche.html", "Diese Woche", "start", exercises=EXERCISES)


async def reflexion(request: Request) -> Response:
    return _page(request, "reflexion.html", "Reflexion", "start", prompts=QUESTIONS)


async def heute(request: Request) -> Response:
    return RedirectResponse("/#checkin", status_code=302)


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
    crisis = crisis_reply(text)
    if crisis:
        return JSONResponse({"reply": crisis, "crisis": True})
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
        Route("/", start),
        Route("/gespraech", chat),
        Route("/ziele", ziele),
        Route("/einblicke", einblicke),
        Route("/einblicke/{slug}", einblick_detail),
        Route("/tagebuch", tagebuch),
        Route("/profil", profil),
        Route("/moment", moment),
        Route("/moment/{slug}", uebung),
        Route("/woche", woche),
        Route("/reflexion", reflexion),
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
