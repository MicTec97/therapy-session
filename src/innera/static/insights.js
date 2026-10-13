const cards = [...document.querySelectorAll("[data-values]")];
const filters = [...document.querySelectorAll("[data-range]")];
const source = document.querySelector("#insight-source");
const count = document.querySelector("#checkin-count");
const topics = document.querySelector("#topics");
let days = 30;

function paint(card) {
  const slug = card.dataset.metric;
  const demo = Innera.preferences().showDemo;
  const flag = card.querySelector(".demo-flag");
  const empty = card.querySelector(".chart-empty");
  const chart = card.querySelector(".chart");
  if (flag) flag.hidden = !demo;
  let windowValues = [];
  let delta = null;
  if (demo) {
    const parsed = card.dataset.values.split(",").map(Number);
    const result = Innera.stats(parsed, days);
    windowValues = result.window;
    delta = result.delta;
  } else {
    const split = Innera.realSplit(slug, days);
    windowValues = split.window;
    const prevAvg = split.previous.length
      ? split.previous.reduce((sum, value) => sum + value, 0) / split.previous.length
      : null;
    const avg = windowValues.length ? windowValues.reduce((sum, value) => sum + value, 0) / windowValues.length : null;
    delta = avg == null || prevAvg == null ? null : avg - prevAvg;
  }
  const status = card.querySelector(".chart-status");
  const deltaNode = card.querySelector(".chart-delta");
  if (!windowValues.length) {
    status.textContent = "Noch offen";
    deltaNode.textContent = "Noch kein Vergleich";
    chart.hidden = true;
    showEmpty(card, "Für diesen Bereich gibt es noch keine Einträge.");
    return;
  }
  const average = windowValues.reduce((sum, value) => sum + value, 0) / windowValues.length;
  status.textContent = Innera.labelFor(slug, average);
  deltaNode.textContent = Innera.formatDelta(delta, days);
  if (windowValues.length < 2) {
    chart.hidden = true;
    showEmpty(card, "Ein Eintrag reicht noch nicht für einen Verlauf.");
    return;
  }
  chart.hidden = false;
  if (empty) empty.hidden = true;
  const drawn = Innera.seriesPoints(windowValues, 320, 120);
  card.querySelector(".line").setAttribute("points", drawn.line);
  card.querySelector(".area").setAttribute("d", drawn.area);
}

function showEmpty(card, message) {
  const empty = card.querySelector(".chart-empty");
  if (!empty) return;
  empty.hidden = false;
  empty.replaceChildren(document.createTextNode(`${message} `));
  if (card.id === "detail-chart") return;
  const link = document.createElement("a");
  link.href = Innera.path(`/einblicke/${card.dataset.metric}`);
  link.textContent = "Einen Moment festhalten";
  empty.append(link);
}

function apply(next) {
  days = next;
  filters.forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.range === String(days) ? "true" : "false");
  });
  cards.forEach(paint);
  const demo = Innera.preferences().showDemo;
  if (source) {
    source.textContent = demo
      ? "Die Kurven zeigen Beispieldaten, nicht deinen Verlauf. Eine Veränderung ist keine Diagnose."
      : "Nur deine Einträge. Eine Veränderung ist keine Diagnose und nicht automatisch eine Verbesserung.";
  }
  if (count) {
    const total = Innera.checkins().filter((item) => Innera.inLastDays(item.day, days)).length;
    if (total === 1) {
      count.textContent = "1 eigener Check-in in diesem Zeitraum. An diesem Tag hast du dir bewusst Zeit genommen.";
    } else if (total > 1) {
      count.textContent = `${total} eigene Check-ins in diesem Zeitraum. An diesen Tagen hast du dir bewusst Zeit genommen.`;
    } else {
      count.textContent = "Eigene Check-ins in diesem Zeitraum: 0.";
    }
  }
  if (topics) {
    const tags = new Set();
    Innera.entries().forEach((entry) => {
      if (!Innera.inLastDays(entry.day, days)) return;
      entry.tags.forEach((tag) => tags.add(tag));
    });
    topics.textContent = tags.size
      ? `Themen in deinen Einträgen: ${[...tags].join(", ")}`
      : "Themen erscheinen, wenn du Einträge mit Tags speicherst.";
  }
}

filters.forEach((button) => {
  button.addEventListener("click", () => apply(Number(button.dataset.range)));
});

const save = document.querySelector("#rate-save");
if (save) {
  let value = null;
  document.querySelectorAll(".scale button").forEach((button) => {
    button.addEventListener("click", () => {
      value = Number(button.dataset.value);
      document.querySelectorAll(".scale button").forEach((item) => {
        item.setAttribute("aria-pressed", item === button ? "true" : "false");
      });
      save.disabled = false;
    });
  });
  save.addEventListener("click", () => {
    const slug = document.querySelector("#detail-chart").dataset.metric;
    if (slug === "stimmung") {
      const mood = { 5: "sehr-gut", 4: "gut", 3: "okay", 2: "schwierig", 1: "schwer" }[value];
      Innera.saveCheckin(mood, value);
    } else {
      Innera.saveMetric(slug, value);
    }
    document.querySelector("#rate-feedback").textContent = Innera.preferences().showDemo
      ? "Gespeichert. Die Kurve bleibt ein Beispiel, bis du Beispieldaten im Profil ausblendest."
      : "Gespeichert. Die Kurve zeigt jetzt deine Einträge.";
    save.disabled = true;
    Innera.toast("Eintrag gespeichert");
    apply(days);
  });
}

if (cards.length) apply(30);
