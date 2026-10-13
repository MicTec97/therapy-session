import os
from pathlib import Path

os.environ["INNERA_PROVIDER"] = "fixed"

from starlette.testclient import TestClient

from innera.app import _prompt, app
from innera.content import FIXED_REPLY, GOAL_AREAS, METRICS, window_stats
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

STATIC = Path(__file__).parents[1] / "src" / "innera" / "static"
SCRIPTS = sorted(path.name for path in STATIC.glob("*.js"))
NAV = ('href="/"', 'href="/gespraech"', 'href="/ziele"', 'href="/einblicke"', 'href="/tagebuch"')
MAIN = ("/", "/gespraech", "/ziele", "/einblicke", "/tagebuch", "/profil", "/moment", "/woche", "/reflexion")


def test_start_is_the_heart_of_the_app() -> None:
    page = client.get("/")

    assert page.status_code == 200
    assert "Schön, dass du da bist" in page.text
    assert "Ein Moment für dich" in page.text
    assert "Deine Entwicklung" in page.text
    assert "Wie fühlst du dich heute?" in page.text
    assert "Dein nächster Schritt" in page.text
    assert "Eine Frage zum Nachdenken" in page.text
    assert 'href="/woche"' in page.text
    assert 'href="/reflexion"' in page.text
    assert "/static/avatar.jpg" in page.text
    assert "Beispiel" in page.text
    for metric in METRICS:
        assert metric.title in page.text


def test_chat_calls_only_the_local_reply_route() -> None:
    page = client.get("/gespraech")
    script = client.get("/static/chat.js")

    assert page.status_code == 200
    assert 'id="composer"' in page.text
    assert 'id="message"' in page.text
    assert "Ich möchte etwas loswerden." in page.text
    assert "Zusammenfassung" in page.text
    assert "Neues Gespräch" in page.text
    assert script.status_code == 200
    assert 'fetch("/api/reply"' in script.text
    assert "api.openai.com" not in script.text
    assert "sk-" not in script.text
    assert "sk-" not in page.text
    for name in SCRIPTS:
        if name == "chat.js":
            continue
        body = (STATIC / name).read_text(encoding="utf-8")
        for marker in REMOTE_MARKERS:
            assert marker not in body


def test_five_areas_link_to_each_other() -> None:
    for path in MAIN:
        page = client.get(path)
        assert page.status_code == 200
        for href in NAV:
            assert href in page.text


def test_goals_insights_journal_and_profile() -> None:
    ziele = client.get("/ziele")
    einblicke = client.get("/einblicke")
    tagebuch = client.get("/tagebuch")
    profil = client.get("/profil")

    assert "Dein Weg" in ziele.text
    assert "Neues Ziel" in ziele.text
    for area in GOAL_AREAS:
        assert area in ziele.text
    assert "built-in method" not in einblicke.text
    assert 'data-values="1' in einblicke.text or 'data-values="2' in einblicke.text or 'data-values="3' in einblicke.text or 'data-values="4' in einblicke.text
    assert "30 Tage" in einblicke.text
    assert "90 Tage" in einblicke.text
    for metric in METRICS:
        assert metric.title in einblicke.text
        assert f'href="/einblicke/{metric.slug}"' in einblicke.text
    assert "Dein Tagebuch" in tagebuch.text
    assert 'id="journal-search"' in tagebuch.text
    assert "Neuer Eintrag" in tagebuch.text
    assert "nicht Ende-zu-Ende-verschlüsselt" in tagebuch.text
    assert "Demo-Daten zurücksetzen" in profil.text
    assert "Demo-Text" in profil.text
    assert "142" in profil.text


def test_exercises_can_be_opened() -> None:
    library = client.get("/moment")
    breath = client.get("/moment/atmen")
    body = client.get("/moment/koerper")
    thoughts = client.get("/moment/gedanken")

    assert "Bewusstes Atmen" in library.text
    assert "Kurzer Body-Check-in" in library.text
    assert "Gedanken sortieren" in library.text
    assert 'id="breath-start"' in breath.text
    assert "Beenden" in breath.text
    assert "Überspringen" in body.text
    assert "Abschließen" in body.text
    assert "Was beschäftigt mich?" in thoughts.text
    assert client.get("/moment/fehlt").status_code == 404
    assert client.get("/einblicke/fehlt").status_code == 404
    detail = client.get("/einblicke/stimmung")
    assert detail.status_code == 200
    assert "Wie nimmst du das heute wahr?" in detail.text


def test_insight_windows_are_different() -> None:
    short, average_short, _ = window_stats(METRICS[0].demo, 7)
    longer, average_long, _ = window_stats(METRICS[0].demo, 30)

    assert len(METRICS[0].demo) == 90
    assert len(short) == 7
    assert len(longer) == 30
    assert average_short != average_long


def test_home_screen_install_metadata() -> None:
    page = client.get("/")
    manifest = client.get("/manifest.webmanifest")
    icon = client.get("/static/apple-touch-icon.png")
    avatar = client.get("/static/avatar.jpg")
    css = client.get("/static/app.css")

    assert 'rel="manifest"' in page.text
    assert "apple-mobile-web-app-capable" in page.text
    assert 'rel="apple-touch-icon"' in page.text
    assert manifest.status_code == 200
    assert manifest.headers["content-type"].startswith("application/manifest+json")
    assert manifest.json()["display"] == "standalone"
    assert manifest.json()["start_url"] == "/"
    assert icon.status_code == 200
    assert icon.content.startswith(b"\x89PNG")
    assert avatar.status_code == 200
    assert avatar.headers["content-type"].startswith("image/jpeg")
    assert "#315c50" in css.text
    assert "prefers-reduced-motion" in css.text


def test_old_checkup_route_returns_home() -> None:
    response = client.get("/heute", follow_redirects=False)

    assert response.status_code == 302
    assert response.headers["location"] == "/#checkin"


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
    response = client.post(
        "/api/reply",
        json={"text": "Hallo", "goals": [{"area": "Karriere", "text": "Ruhiger werden"}]},
    )

    assert response.status_code == 200
    assert response.json()["reply"] == FIXED_REPLY


def test_crisis_reply_skips_the_model() -> None:
    response = client.post("/api/reply", json={"text": "Ich will sterben"})

    assert response.status_code == 200
    body = response.json()
    assert body["crisis"] is True
    assert "142" in body["reply"]
    assert body["reply"] != FIXED_REPLY


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


def test_pages_export_is_a_relative_click_dummy(tmp_path: Path) -> None:
    from innera.export_pages import export_pages

    dest = export_pages(tmp_path)
    home = (dest / "index.html").read_text(encoding="utf-8")
    room = (dest / "gespraech" / "index.html").read_text(encoding="utf-8")
    detail = (dest / "einblicke" / "stimmung" / "index.html").read_text(encoding="utf-8")

    assert "Schön, dass du da bist" in home
    assert 'data-static="1"' in home
    assert 'href="gespraech/"' in home
    assert 'href="/gespraech"' not in home
    assert "static/app.css" in home
    assert (dest / "static" / "avatar.jpg").is_file()
    assert (dest / ".nojekyll").is_file()
    assert 'data-base="../"' in room
    assert 'data-base="../../"' in detail
    assert "sk-" not in home
    assert "api.openai.com" not in room
