const hello = document.querySelector("#hello");
const dateLabel = document.querySelector("#today-label");
const feedback = document.querySelector("#checkin-feedback");
const save = document.querySelector("#checkin-save");
const moods = [...document.querySelectorAll(".mood")];
const grid = document.querySelector("#insight-grid");
const badge = document.querySelector("#demo-badge");
const note = document.querySelector("#demo-note");

const name = Innera.preferences().name.trim();
if (name && hello.firstChild) {
  hello.firstChild.textContent = `Schön, dass du da bist, ${name}.`;
}

dateLabel.textContent = new Date().toLocaleDateString("de-AT", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

let selected = null;

function markMood(mood) {
  selected = mood;
  moods.forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.mood === mood ? "true" : "false");
  });
  save.disabled = !mood;
}

let savedMood = null;
const today = Innera.checkins().find((item) => item.day === Innera.todayKey());
if (today) {
  savedMood = today.mood;
  markMood(savedMood);
  feedback.textContent = Innera.REPLIES[savedMood] || "";
  save.textContent = "Auswahl ändern";
  save.disabled = true;
}

function syncSave() {
  const unchanged = Boolean(savedMood && selected === savedMood);
  save.textContent = unchanged ? "Auswahl ändern" : "Festhalten";
  save.disabled = !selected || unchanged;
}

moods.forEach((button) => {
  button.addEventListener("click", () => {
    markMood(button.dataset.mood);
    syncSave();
  });
});

save.addEventListener("click", () => {
  const button = moods.find((item) => item.dataset.mood === selected);
  if (!button) return;
  Innera.saveCheckin(selected, button.dataset.value);
  savedMood = selected;
  feedback.textContent = Innera.REPLIES[selected] || "";
  save.disabled = true;
  save.textContent = "Festgehalten";
  Innera.toast("Check-in gespeichert");
});

function renderPersonal() {
  if (Innera.preferences().showDemo) return;
  badge.hidden = true;
  note.textContent = "Nur deine Einträge. Leere Bereiche füllen sich, wenn du sie festhältst.";
  grid.replaceChildren();
  Object.keys(Innera.TITLES).forEach((slug) => {
    const mine = Innera.metricEntries()
      .filter((item) => item.metric === slug)
      .sort((a, b) => a.day.localeCompare(b.day));
    const card = document.createElement("a");
    card.className = `insight-card tint-${Innera.TINTS[slug]}`;
    card.href = `/einblicke/${slug}`;
    const title = document.createElement("h3");
    title.textContent = Innera.TITLES[slug];
    const status = document.createElement("p");
    status.className = "status";
    status.textContent = mine.length ? Innera.labelFor(slug, mine[mine.length - 1].value) : "Noch offen";
    const delta = document.createElement("p");
    delta.className = "delta";
    delta.textContent = mine.length ? "Dein Eintrag" : "Noch kein Eintrag";
    card.append(title, status, delta);
    grid.append(card);
  });
}

renderPersonal();

const done = Innera.sessions().filter((item) => item.completed && Innera.dayOf(item.endedAt) >= Innera.todayKey(Innera.weekStart())).length;
const capped = Math.min(3, done);
const meter = document.querySelector("#week-meter");
const bar = document.querySelector("#week-meter-bar");
const meterLabel = document.querySelector("#week-meter-label");
meter.setAttribute("aria-valuenow", String(capped));
bar.style.width = `${(capped / 3) * 100}%`;
meterLabel.textContent = capped === 0 ? "Noch offen diese Woche." : `${capped} von 3 Übungen diese Woche.`;
