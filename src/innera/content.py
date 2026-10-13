"""Copy, catalogs, and demo series for the INNERA prototype."""

import math
from dataclasses import dataclass
from datetime import date

FIXED_REPLY = (
    "Danke, dass du das teilst. Wir müssen das nicht sofort lösen. "
    "Was davon fühlt sich gerade am nächsten an?"
)

SESSION_OPENING = "Ich bin da. Was beschäftigt dich gerade?"

SESSION_CLOSING = "Die Session ist zu Ende. Danke, dass du da warst."

SESSION_MINUTES = 20

SYSTEM_PROMPT = (
    "Du bist INNERA, eine ruhige Begleitung für Reflexion. "
    "Du bist kein Therapeut und keine Ärztin, diagnostizierst nicht und ersetzt keine menschliche Hilfe. "
    "Antworte auf Deutsch, warm, knapp und am Gesagten. "
    "Spiegle vorsichtig, lass Wahlfreiheit und beende nicht jede Antwort mit einer Frage. "
    "Schlage höchstens einen kleinen nächsten Schritt vor. "
    "Bei Hinweisen auf Selbstgefährdung verweise auf den Notruf 144 und die Telefonseelsorge 142 "
    "und mach nicht in einem gewöhnlichen Wohlfühlgespräch weiter."
)

GOAL_AREAS = ("Karriere", "Beziehung", "Alltag", "Körper", "Ruhe", "Selbst")

GOAL_FREQUENCIES = ("Täglich", "Mehrmals pro Woche", "Wöchentlich", "Wenn es passt")

CHECKUP_MOODS = (
    ("sehr-gut", "Sehr gut", 5),
    ("gut", "Gut", 4),
    ("okay", "Okay", 3),
    ("schwierig", "Schwierig", 2),
    ("schwer", "Schwer", 1),
)

CHECKUP_REPLIES = {
    "sehr-gut": "Schön, dass es sich heute leichter anfühlt.",
    "gut": "Danke, dass du kurz innegehalten hast.",
    "okay": "Okay ist ein ehrlicher Ort. Das reicht.",
    "schwierig": "Danke, dass du das so benennst. Du musst es nicht schönreden.",
    "schwer": "Das klingt nach einem schweren Moment. Du darfst dir Hilfe holen, wenn du sie brauchst.",
}

IMPULSES = (
    "Ich möchte etwas loswerden.",
    "Ich fühle mich gerade überfordert.",
    "Ich möchte mich selbst besser verstehen.",
    "Ich brauche einen Moment Ruhe.",
    "Ich weiß nicht genau, was ich fühle.",
)

QUESTIONS = (
    "Was würde ich heute tun, wenn ich mir selbst ein bisschen mehr vertrauen würde?",
    "Wobei habe ich mir heute schon etwas Gutes getan, auch wenn es klein war?",
    "Was darf heute unfertig bleiben?",
    "Welche Grenze würde mir morgen den Tag leichter machen?",
    "Was brauche ich gerade mehr: Nähe, Ruhe oder Klarheit?",
    "Woran merke ich, dass ich genug getan habe?",
    "Welcher Gedanke darf heute nur ein Gedanke bleiben?",
)

JOURNAL_PROMPTS = (
    "Was ist heute leiser geworden?",
    "Was möchte ich morgen freundlicher behandeln?",
    "Ein Moment, der sich wahr angefühlt hat.",
)

BODY_STEPS = (
    "Wo nimmst du gerade Anspannung wahr?",
    "Gibt es eine Stelle, die sich eher weich oder ruhig anfühlt?",
    "Was bräuchte dein Körper in den nächsten Minuten?",
)

EXERCISES = (
    {
        "slug": "atmen",
        "title": "Bewusstes Atmen",
        "minutes": 3,
        "text": "Ein ruhiger Rhythmus. Du kannst jederzeit aufhören.",
    },
    {
        "slug": "koerper",
        "title": "Kurzer Body-Check-in",
        "minutes": 4,
        "text": "Drei Fragen, alle optional. Nichts davon muss beantwortet werden.",
    },
    {
        "slug": "gedanken",
        "title": "Gedanken sortieren",
        "minutes": 6,
        "text": "Auseinanderlegen, was da ist, was du beeinflussen kannst und was du brauchst.",
    },
)

CRISIS_REPLY = (
    "Danke, dass du das sagst. Wenn du in Gefahr bist oder dir gerade etwas antun könntest, "
    "hol dir bitte sofort menschliche Hilfe.\n\n"
    "Notruf: 144\n"
    "Telefonseelsorge Österreich: 142, rund um die Uhr\n"
    "Rat auf Draht: 147\n\n"
    "Ich bin kein Ersatz für Notfallhilfe. Diese Nummern sind öffentliche Angebote "
    "und sollten vor einer produktiven Nutzung geprüft werden."
)

_CRISIS_PHRASES = (
    "umbringen",
    "suizid",
    "selbstmord",
    "selbst verletzen",
    "selbstverletzung",
    "nicht mehr leben",
    "will sterben",
    "mich töten",
    "mir das leben nehmen",
    "mir was antun",
    "mir etwas antun",
)


def crisis_reply(text: str) -> str | None:
    folded = text.casefold()
    if any(phrase in folded for phrase in _CRISIS_PHRASES):
        return CRISIS_REPLY
    return None


def question_for(day: date | None = None) -> str:
    chosen = day or date.today()
    return QUESTIONS[chosen.toordinal() % len(QUESTIONS)]


@dataclass(frozen=True)
class Metric:
    slug: str
    title: str
    hint: str
    tint: str
    labels: tuple[str, ...]
    demo: tuple[float, ...]


def _wave(days: int, phase: float, base: float, amp: float, tilt: float) -> tuple[float, ...]:
    values: list[float] = []
    for index in range(days):
        progress = index / max(days - 1, 1)
        value = base + amp * math.sin(index / 5.5 + phase) + 0.12 * math.sin(index / 2.3)
        value += (progress - 0.5) * tilt
        values.append(round(min(4.8, max(1.2, value)), 2))
    return tuple(values)


def _metrics() -> tuple[Metric, ...]:
    return (
        Metric(
            "stimmung",
            "Stimmung",
            "Wie sich dein Tag emotional angefühlt hat.",
            "sand",
            ("Schwer", "Unruhig", "Okay", "Ruhig", "Getragen"),
            _wave(90, 0.4, 3.5, 0.55, 0.5),
        ),
        Metric(
            "klarheit",
            "Mentale Klarheit",
            "Wie sortiert oder zerstreut sich deine Gedanken angefühlt haben.",
            "rose",
            ("Zerstreut", "Unklar", "Okay", "Sortiert", "Klar"),
            _wave(90, 2.1, 2.7, 0.45, -0.35),
        ),
        Metric(
            "energie",
            "Energie",
            "Wie viel Kraft du für den Tag wahrgenommen hast.",
            "apricot",
            ("Erschöpft", "Niedrig", "Stabil", "Wach", "Kraftvoll"),
            _wave(90, 1.1, 3.3, 0.6, 0.7),
        ),
        Metric(
            "zuversicht",
            "Zuversicht",
            "Wie zuversichtlich du nach vorne geschaut hast.",
            "sage",
            ("Zaghaft", "Unsicher", "Okay", "Zuversichtlich", "Getragen"),
            _wave(90, 0.8, 3.4, 0.4, 0.45),
        ),
        Metric(
            "koerper",
            "Körperliches Wohlbefinden",
            "Wie sich dein Körper angefühlt hat, ohne Wertung.",
            "sky",
            ("Angespannt", "Schwer", "Ganz okay", "Leicht", "Wohl"),
            _wave(90, 1.7, 3.2, 0.35, 0.3),
        ),
        Metric(
            "ruhe",
            "Innere Ruhe",
            "Wie viel Ruhe du dir nehmen konntest.",
            "lavender",
            ("Laut", "Unruhig", "Okay", "Ruhiger", "Still"),
            _wave(90, 2.6, 2.9, 0.4, 0.55),
        ),
    )


METRICS = _metrics()


def metric_by_slug(slug: str) -> Metric | None:
    return next((metric for metric in METRICS if metric.slug == slug), None)


def label_for(labels: tuple[str, ...], average: float) -> str:
    index = max(0, min(len(labels) - 1, round(average) - 1))
    return labels[index]


def format_delta_short(delta: float | None) -> str:
    if delta is None:
        return "–"
    rounded = round(delta, 1)
    if rounded == 0:
        return "0,0"
    return f"{rounded:+.1f}".replace(".", ",")


def format_delta(delta: float | None, days: int) -> str:
    if delta is None:
        return "Noch kein Vergleich"
    rounded = round(delta, 1)
    if rounded == 0:
        number = "0,0"
    else:
        number = f"{rounded:+.1f}".replace(".", ",")
    return f"{number} gegenüber den {days} Tagen davor"


def window_stats(values: tuple[float, ...] | list[float], days: int) -> tuple[list[float], float, float | None]:
    series = list(values)
    window = series[-days:]
    previous = series[-2 * days : -days]
    average = sum(window) / len(window)
    delta = None if not previous else average - (sum(previous) / len(previous))
    return window, average, delta


def polyline(values: list[float], width: float = 120, height: float = 36) -> str:
    if len(values) < 2:
        return ""
    low = min(values)
    high = max(values)
    span = high - low or 1
    step = width / (len(values) - 1)
    coords: list[str] = []
    for index, value in enumerate(values):
        x = index * step
        y = height - ((value - low) / span) * (height - 10) - 5
        coords.append(f"{x:.1f},{y:.1f}")
    return " ".join(coords)


def area_path(values: list[float], width: float = 320, height: float = 120) -> str:
    if len(values) < 2:
        return ""
    low = min(values)
    high = max(values)
    span = high - low or 1
    step = width / (len(values) - 1)
    points: list[tuple[float, float]] = []
    for index, value in enumerate(values):
        x = index * step
        y = height - ((value - low) / span) * (height - 24) - 12
        points.append((x, y))
    commands = [f"M{points[0][0]:.1f},{points[0][1]:.1f}"]
    commands.extend(f"L{x:.1f},{y:.1f}" for x, y in points[1:])
    commands.append(f"L{points[-1][0]:.1f},{height:.1f}")
    commands.append(f"L{points[0][0]:.1f},{height:.1f} Z")
    return " ".join(commands)


def metric_view(metric: Metric, days: int = 14, chart: bool = False) -> dict[str, str | float]:
    window, average, delta = window_stats(metric.demo, days)
    width = 320 if chart else 120
    height = 120 if chart else 36
    return {
        "slug": metric.slug,
        "title": metric.title,
        "hint": metric.hint,
        "tint": metric.tint,
        "status": label_for(metric.labels, average),
        "delta": format_delta(delta, days),
        "change": format_delta_short(delta),
        "spark": polyline(window, width, height),
        "area": area_path(window, width, height) if chart else "",
        "series": ",".join(str(value) for value in metric.demo),
    }


def home_metrics() -> list[dict[str, str | float]]:
    return [metric_view(metric, 14) for metric in METRICS]


def insight_metrics(days: int = 30) -> list[dict[str, str | float]]:
    return [metric_view(metric, days, chart=True) for metric in METRICS]
