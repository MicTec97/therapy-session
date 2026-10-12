"""Static copy for the app."""

from dataclasses import dataclass


FIXED_REPLY = (
    "Danke, dass du das teilst. Wir müssen das nicht sofort lösen. "
    "Was davon fühlt sich gerade am nächsten an?"
)

SESSION_OPENING = (
    "Die Session ist offen. Du kannst alles sagen, was gerade da ist. "
    "Wir haben 20 Minuten."
)

SESSION_CLOSING = "Die Session ist zu Ende. Danke, dass du da warst."

SESSION_MINUTES = 20

SYSTEM_PROMPT = (
    "Du bist INNERA, ein ruhiger Gesprächspartner für Reflexion. "
    "Du diagnostizierst nicht und ersetzt keine Therapie oder medizinische Hilfe. "
    "Antworte kurz, warm und auf Deutsch. "
    "Wenn jemand in akuter Gefahr ist, weise auf den örtlichen Notruf hin."
)

GOAL_AREAS = ("Karriere", "Beziehung")

CHECKUP_MOODS = ("Sehr gut", "Gut", "Okay", "Schwer")

CHECKUP_EFFORT = ("Ja", "Ein bisschen", "Noch nicht")


@dataclass(frozen=True)
class Message:
    role: str
    text: str


def _line(values: tuple[float, ...]) -> str:
    width = 120
    height = 36
    low = min(values)
    high = max(values)
    span = high - low or 1
    step = width / (len(values) - 1)
    coords: list[str] = []
    for index, value in enumerate(values):
        x = index * step
        y = height - ((value - low) / span) * (height - 6) - 3
        coords.append(f"{x:.1f},{y:.1f}")
    return " ".join(coords)


INSIGHT_LINE = _line((2.0, 2.3, 2.1, 3.0, 3.6, 4.1, 4.8))
