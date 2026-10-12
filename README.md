# INNERA

Dein persönlicher KI-Begleiter für ein erfüllteres Leben.

INNERA is a personal companion for reflection and daily support. The tone is warm, open, and honest: it stays on your side and works in small steps.

## What it is not

INNERA is a wellness companion. It does not diagnose, treat, or replace a therapist or medical care. If you are in crisis, contact local emergency services or a qualified professional.

## v0

A local app. The conversation room calls the model through `ModelProvider`.

- **Raum** (`/`) — a conversation room with an avatar. The first visit asks for goals. A session has a start, an end, and a 20-minute window.
- **Ziele** (`/ziele`) — Karriere and Beziehung, with progress taken from check-ups.
- **Einblicke** (`/einblicke`) — a chart of how the check-up answers move over time.
- **Heute** (`/heute`) — a short check-up: how the day was, whether a goal got attention, and one sentence to keep.

Replies use OpenAI. The model name lives in `.env` as `OPENAI_MODEL` (default `gpt-6-luna`, the cheap tier). Set it to `gpt-5.6-luna` to use that model instead. Copy `.env.example` to `.env` and add your key. The key stays out of the source tree.

## Later

A user-specific memory: entities, relations, and a database.

## Run

```bash
uv sync
uv run uvicorn innera.app:app --reload
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000).

## On an iPhone

The click-dummy installs from Safari onto the home screen. A native `.ipa` needs a Mac, Xcode, and an Apple developer signature, so this repo does not ship one.

The phone loads the app from this computer. Keep the server running, and keep both devices on the same Wi-Fi.

```bash
uv run uvicorn innera.app:app --host 0.0.0.0 --port 8000
```

On the iPhone, open Safari at `http://<this-computer>:8000` (right now that is `http://192.168.1.101:8000`). Tap the Share button, then **Add to Home Screen**, then **Add**. INNERA opens from the icon in its own window, without the Safari toolbar. Windows may ask to allow Python through the firewall the first time.

## Tests

```bash
uv run pytest
```

Project rules live in [AGENTS.md](AGENTS.md).
