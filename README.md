# INNERA

Dein persönlicher KI-Begleiter für ein erfüllteres Leben.

INNERA is a personal companion for reflection and daily support. The tone is warm, open, and honest: it stays on your side and works in small steps.

## What it is not

INNERA is a wellness companion. It does not diagnose, treat, or replace a therapist or medical care. If you are in crisis, contact local emergency services or a qualified professional.

## Prototype

A local click-through app. Five areas share one warm layout. The conversation room calls the model through `ModelProvider`. Check-ins, goals, journal entries, and exercise notes stay in the browser until you reset them. Sample charts are labeled Beispiel.

- **Start** (`/`) — greeting, avatar, six insight cards, a daily check-in, the week, and a reflection question.
- **Gespräch** (`/gespraech`) — a quiet room with impulses, a live reply, and an optional summary you can save to the journal. The transcript itself is not stored.
- **Ziele** (`/ziele`) — create, edit, pause, complete, and delete personal goals.
- **Einblicke** (`/einblicke`) — six areas over 7, 30, or 90 days. Without your own entries the curves are demo data.
- **Tagebuch** (`/tagebuch`) — private notes on this device, with search, tags, edit, and delete.

Ein Moment für dich (`/moment`) opens breathing, a body check-in, and thought sorting. Profile (`/profil`) holds your name, the demo-data switch, and a reset.

Replies use OpenAI when `OPENAI_API_KEY` is set. Otherwise the app answers with a fixed local line and says so in the profile. The model name lives in `.env` as `OPENAI_MODEL` (default `gpt-6-luna`). Set it to `gpt-5.6-luna` to switch. The key stays out of the source tree.

## Later

A user-specific memory: entities, relations, and a database.

## Clone and start

Backend and the pages are one process. The server serves the screens and answers `POST /api/reply`. There is no separate frontend server to start.

You need [uv](https://docs.astral.sh/uv/) and Python 3.13.

```bash
git clone https://github.com/MicTec97/therapy-session.git
cd therapy-session
uv sync
```

Copy the env file and put your key in `OPENAI_API_KEY`. Without a key the app still opens and answers with a fixed local line.

```bash
# macOS / Linux
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

Start the app:

```bash
uv run uvicorn innera.app:app --reload
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000). `--reload` picks up Python and template changes. The model name is `OPENAI_MODEL` in `.env` (default `gpt-6-luna`).

## On an iPhone

The click-dummy installs from Safari onto the home screen. A native `.ipa` needs a Mac, Xcode, and an Apple developer signature, so this repo does not ship one.

The phone loads the app from this computer. Keep the server running, and keep both devices on the same Wi-Fi.

```bash
uv run uvicorn innera.app:app --host 0.0.0.0 --port 8000
```

On the iPhone, open Safari at `http://<this-computer>:8000` (right now that is `http://192.168.1.101:8000`). Tap the Share button, then **Add to Home Screen**, then **Add**. INNERA opens from the icon in its own window, without the Safari toolbar. Windows may ask to allow Python through the firewall the first time.

## GitHub Pages

`docs/` is a static click-through of the same screens for showing the design. It does not run the model. The conversation answers with the fixed local line, and check-ins, goals, and journal notes stay in that browser.

Publish it from the repository settings: Pages, branch `main`, folder `/docs`. The site is then [https://mictec97.github.io/therapy-session/](https://mictec97.github.io/therapy-session/).

Rebuild the folder after screen changes:

```bash
uv run python -m innera.export_pages
```

## Tests

```bash
uv run pytest
```

Project rules live in [AGENTS.md](AGENTS.md).
