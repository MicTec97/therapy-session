import os

os.environ["INNERA_PROVIDER"] = "fixed"

from starlette.testclient import TestClient

from innera.app import _prompt, app
from innera.content import FIXED_REPLY, GOAL_AREAS
from innera.providers import DEFAULT_MODEL, FixedReplyProvider, ModelProvider, OpenAIProvider

client = TestClient(app)

REMOTE_MARKERS = (
    "fetch(",
    "XMLHttpRequest",
    "WebSocket",
    "EventSource",
    "sendBeacon",
    "http://",
    "https://",
)

PAGES = ("/", "/ziele", "/einblicke", "/heute")
SCRIPTS = (
    "/static/chat.js",
    "/static/store.js",
    "/static/goals.js",
    "/static/checkup.js",
    "/static/insights.js",
)


def test_room_asks_for_goals_and_has_a_session() -> None:
    page = client.get("/")

    assert page.status_code == 200
    assert "Gesprächsraum" in page.text
    assert "Woran möchtest du arbeiten?" in page.text
    assert 'id="session-toggle"' in page.text
    assert 'id="message"' in page.text
    for area in GOAL_AREAS:
        assert area in page.text


def test_chat_calls_only_the_local_reply_route() -> None:
    page = client.get("/")
    script = client.get("/static/chat.js")

    assert 'id="composer"' in page.text
    assert script.status_code == 200
    assert 'fetch("/api/reply"' in script.text
    assert "api.openai.com" not in script.text
    assert "sk-" not in script.text
    assert "sk-" not in page.text
    for other in SCRIPTS:
        if other == "/static/chat.js":
            continue
        body = client.get(other)
        assert body.status_code == 200
        for marker in REMOTE_MARKERS:
            assert marker not in body.text


def test_goals_insights_and_checkup_exist() -> None:
    ziele = client.get("/ziele")
    einblicke = client.get("/einblicke")
    heute = client.get("/heute")

    assert ziele.status_code == 200
    assert "Ziele" in ziele.text
    assert einblicke.status_code == 200
    assert "Einblicke" in einblicke.text
    assert 'id="insight-line"' in einblicke.text
    assert heute.status_code == 200
    assert "Wie war dein Tag?" in heute.text
    for area in GOAL_AREAS:
        assert area in ziele.text
        assert area in einblicke.text


def test_screens_link_to_each_other() -> None:
    for path in PAGES:
        page = client.get(path)
        assert page.status_code == 200
        for href in ('href="/"', 'href="/ziele"', 'href="/einblicke"', 'href="/heute"'):
            assert href in page.text


def test_home_screen_install_metadata() -> None:
    page = client.get("/")
    manifest = client.get("/manifest.webmanifest")
    icon = client.get("/static/apple-touch-icon.png")

    assert page.status_code == 200
    assert 'rel="manifest"' in page.text
    assert "apple-mobile-web-app-capable" in page.text
    assert 'rel="apple-touch-icon"' in page.text
    assert manifest.status_code == 200
    assert manifest.headers["content-type"].startswith("application/manifest+json")
    assert manifest.json()["display"] == "standalone"
    assert manifest.json()["start_url"] == "/"
    assert icon.status_code == 200
    assert icon.headers["content-type"].startswith("image/png")
    assert icon.content.startswith(b"\x89PNG")


def test_fixed_reply_provider_is_local() -> None:
    provider = FixedReplyProvider()

    assert isinstance(provider, ModelProvider)
    assert provider.complete("Wie war dein Tag?") == FIXED_REPLY


def test_prompt_keeps_the_session_and_goals() -> None:
    prompt = _prompt(
        "Hallo",
        [{"area": "Karriere", "text": "Ruhiger werden"}],
        [{"role": "assistant", "text": "Die Session ist offen."}],
    )

    assert "Karriere: Ruhiger werden" in prompt
    assert "INNERA: Die Session ist offen." in prompt
    assert prompt.endswith("Hallo")


def test_reply_rejects_empty_and_broken_bodies() -> None:
    empty = client.post("/api/reply", json={"text": "  "})
    broken = client.post(
        "/api/reply",
        content=b"nope",
        headers={"content-type": "application/json"},
    )
    listing = client.post("/api/reply", json=["Hallo"])

    assert empty.status_code == 400
    assert broken.status_code == 400
    assert listing.status_code == 400


def test_reply_route_uses_the_installed_provider() -> None:
    response = client.post("/api/reply", json={"text": "Hallo", "goals": [{"area": "Karriere", "text": "Ruhiger werden"}]})

    assert response.status_code == 200
    assert response.json()["reply"] == FIXED_REPLY


def test_openai_provider_uses_the_chosen_model() -> None:
    captured: dict[str, object] = {}

    class _Message:
        content = "Ich höre dir zu."

    class _Choice:
        message = _Message()

    class _Response:
        choices = [_Choice()]

    class _Completions:
        def create(self, **kwargs: object) -> _Response:
            captured.update(kwargs)
            return _Response()

    class _Chat:
        completions = _Completions()

    class _Client:
        chat = _Chat()

    provider = OpenAIProvider(client=_Client(), model="gpt-5.6-luna")

    assert provider.complete("Hallo") == "Ich höre dir zu."
    assert captured["model"] == "gpt-5.6-luna"
    assert captured["reasoning_effort"] == "none"
    assert DEFAULT_MODEL == "gpt-6-luna"
