const KEYS = {
  preferences: "innera.preferences",
  checkins: "innera.checkins",
  metrics: "innera.metrics",
  goals: "innera.goals",
  journal: "innera.journal",
  sessions: "innera.sessions",
};

const LABELS = {
  stimmung: ["Schwer", "Unruhig", "Okay", "Ruhig", "Getragen"],
  klarheit: ["Zerstreut", "Unklar", "Okay", "Sortiert", "Klar"],
  energie: ["Erschöpft", "Niedrig", "Stabil", "Wach", "Kraftvoll"],
  zuversicht: ["Zaghaft", "Unsicher", "Okay", "Zuversichtlich", "Getragen"],
  koerper: ["Angespannt", "Schwer", "Ganz okay", "Leicht", "Wohl"],
  ruhe: ["Laut", "Unruhig", "Okay", "Ruhiger", "Still"],
};

const TITLES = {
  stimmung: "Stimmung",
  klarheit: "Mentale Klarheit",
  energie: "Energie",
  zuversicht: "Zuversicht",
  koerper: "Körperliches Wohlbefinden",
  ruhe: "Innere Ruhe",
};

const TINTS = {
  stimmung: "sand",
  klarheit: "rose",
  energie: "apricot",
  zuversicht: "sage",
  koerper: "sky",
  ruhe: "lavender",
};

const REPLIES = {
  "sehr-gut": "Schön, dass es sich heute leichter anfühlt.",
  gut: "Danke, dass du kurz innegehalten hast.",
  okay: "Okay ist ein ehrlicher Ort. Das reicht.",
  schwierig: "Danke, dass du das so benennst. Du musst es nicht schönreden.",
  schwer: "Das klingt nach einem schweren Moment. Du darfst dir Hilfe holen, wenn du sie brauchst.",
};

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch (error) {
    return null;
  }
}

function readList(key) {
  const value = readJson(key);
  return Array.isArray(value) ? value : [];
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid() {
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function todayKey(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function weekStart(date = new Date()) {
  const copy = new Date(date);
  const offset = (copy.getDay() + 6) % 7;
  copy.setHours(0, 0, 0, 0);
  copy.setDate(copy.getDate() - offset);
  return copy;
}

function shiftKey(daysBack) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - daysBack);
  return todayKey(date);
}

function inLastDays(day, days) {
  return day >= shiftKey(days - 1) && day <= todayKey();
}

function inPreviousDays(day, days) {
  return day >= shiftKey(days * 2 - 1) && day < shiftKey(days - 1);
}

function preferences() {
  const value = readJson(KEYS.preferences);
  const base = { name: "", notifications: false, notifyTime: "20:00", showDemo: true };
  if (!value || typeof value !== "object" || Array.isArray(value)) return base;
  return {
    ...base,
    ...value,
    name: String(value.name || "").slice(0, 40),
    showDemo: value.showDemo !== false,
  };
}

function savePreferences(patch) {
  const next = { ...preferences(), ...patch, name: String(patch.name ?? preferences().name).slice(0, 40) };
  writeJson(KEYS.preferences, next);
  return next;
}

function checkins() {
  const stored = readList(KEYS.checkins).filter((item) => item && item.day && item.mood);
  if (stored.length) return stored;
  return readList("innera.checkups").map((item) => ({
    id: uid(),
    mood: String(item.mood || "okay"),
    value: Number(item.value || 3),
    day: String(item.at || "").slice(0, 10) || todayKey(),
    at: String(item.at || new Date().toISOString()),
  }));
}

function saveMetric(metric, value) {
  const day = todayKey();
  const entry = { id: uid(), metric, value: Number(value), day, at: new Date().toISOString() };
  const rest = metricEntries().filter((item) => !(item.metric === metric && item.day === day));
  writeJson(KEYS.metrics, [...rest, entry]);
  return entry;
}

function metricEntries() {
  return readList(KEYS.metrics).filter((item) => item && item.metric && item.day && item.value);
}

function saveCheckin(mood, value) {
  const day = todayKey();
  const entry = { id: uid(), mood, value: Number(value), day, at: new Date().toISOString() };
  const rest = checkins().filter((item) => item.day !== day);
  writeJson(KEYS.checkins, [...rest, entry]);
  saveMetric("stimmung", value);
  return entry;
}

function normalizeGoal(goal) {
  if (!goal || typeof goal !== "object") return null;
  const title = String(goal.title || goal.text || "").trim();
  const area = String(goal.area || "").trim();
  if (!title && !area) return null;
  const status = ["active", "paused", "done"].includes(goal.status) ? goal.status : "active";
  return {
    id: String(goal.id || uid()),
    title: title || area,
    description: String(goal.description || ""),
    area: area || "Alltag",
    frequency: String(goal.frequency || "Wenn es passt"),
    start: String(goal.start || todayKey()),
    end: String(goal.end || ""),
    status,
    attended: Array.isArray(goal.attended) ? goal.attended.map(String) : [],
    text: title || area,
  };
}

function goals() {
  const raw = readList(KEYS.goals);
  let dirty = false;
  const next = [];
  for (const goal of raw) {
    if (!goal || !goal.id) dirty = true;
    const item = normalizeGoal(goal);
    if (item) next.push(item);
  }
  if (dirty) writeJson(KEYS.goals, next);
  return next;
}

function saveGoal(goal) {
  const item = normalizeGoal(goal);
  const current = goals();
  const index = current.findIndex((entry) => entry.id === item.id);
  if (index >= 0) current[index] = item;
  else current.push(item);
  writeJson(KEYS.goals, current);
  return item;
}

function removeGoal(id) {
  writeJson(KEYS.goals, goals().filter((goal) => goal.id !== id));
}

function normalizeEntry(entry) {
  if (!entry || typeof entry !== "object") return null;
  const body = String(entry.body || "").trim();
  if (!body) return null;
  const at = String(entry.at || new Date().toISOString());
  return {
    id: String(entry.id || uid()),
    title: String(entry.title || "").slice(0, 80),
    body,
    tags: Array.isArray(entry.tags) ? entry.tags.map((tag) => String(tag).trim()).filter(Boolean) : [],
    at,
    day: String(entry.day || at.slice(0, 10)),
    updatedAt: String(entry.updatedAt || at),
    source: String(entry.source || "tagebuch"),
  };
}

function entries() {
  const raw = readList(KEYS.journal);
  let dirty = false;
  const next = [];
  for (const entry of raw) {
    if (!entry || !entry.id) dirty = true;
    const item = normalizeEntry(entry);
    if (item) next.push(item);
  }
  next.sort((a, b) => b.at.localeCompare(a.at));
  if (dirty) writeJson(KEYS.journal, next);
  return next;
}

function dayOf(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return todayKey(date);
}

function saveEntry(entry) {
  const now = new Date().toISOString();
  const item = normalizeEntry({
    ...entry,
    at: entry.at || now,
    updatedAt: now,
    day: entry.day || todayKey(),
  });
  if (!item) return null;
  const current = entries().filter((existing) => existing.id !== item.id);
  current.push(item);
  current.sort((a, b) => b.at.localeCompare(a.at));
  writeJson(KEYS.journal, current);
  return item;
}

function removeEntry(id) {
  writeJson(KEYS.journal, entries().filter((entry) => entry.id !== id));
}

function sessions() {
  return readList(KEYS.sessions).filter((item) => item && item.kind);
}

function saveSession(session) {
  const item = {
    id: uid(),
    kind: String(session.kind),
    startedAt: String(session.startedAt || new Date().toISOString()),
    endedAt: new Date().toISOString(),
    completed: Boolean(session.completed),
  };
  writeJson(KEYS.sessions, [...sessions(), item]);
  return item;
}

function resetStore() {
  const keys = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key && key.startsWith("innera.")) keys.push(key);
  }
  keys.forEach((key) => localStorage.removeItem(key));
}

function toast(message) {
  const node = document.querySelector("#toast");
  if (!node) return;
  node.hidden = false;
  node.textContent = message;
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => {
    node.hidden = true;
  }, 2400);
}

function stats(values, days) {
  const series = values.map(Number).filter((value) => !Number.isNaN(value));
  const windowValues = series.slice(-days);
  const previous = series.slice(-2 * days, -days);
  const avg = windowValues.reduce((sum, value) => sum + value, 0) / windowValues.length;
  const prevAvg = previous.length ? previous.reduce((sum, value) => sum + value, 0) / previous.length : null;
  return { window: windowValues, previous, avg, delta: prevAvg == null ? null : avg - prevAvg };
}

function realSplit(metric, days) {
  const mine = metricEntries().filter((item) => item.metric === metric);
  return {
    window: mine.filter((item) => inLastDays(item.day, days)).map((item) => Number(item.value)),
    previous: mine.filter((item) => inPreviousDays(item.day, days)).map((item) => Number(item.value)),
  };
}

function formatDelta(delta, days) {
  if (delta == null || Number.isNaN(delta)) return "Noch kein Vergleich";
  const rounded = Math.round(delta * 10) / 10;
  const number = rounded === 0 ? "0,0" : `${rounded > 0 ? "+" : ""}${rounded.toFixed(1).replace(".", ",")}`;
  return `${number} gegenüber den ${days} Tagen davor`;
}

function labelFor(metric, average) {
  const labels = LABELS[metric] || LABELS.stimmung;
  const index = Math.max(0, Math.min(labels.length - 1, Math.round(average) - 1));
  return labels[index];
}

function seriesPoints(values, width, height) {
  const pairs = (inset) => {
    if (values.length < 2) return [];
    const low = Math.min(...values);
    const high = Math.max(...values);
    const span = high - low || 1;
    const step = width / (values.length - 1);
    return values.map((value, index) => {
      const x = index * step;
      const y = height - ((value - low) / span) * (height - inset * 2) - inset;
      return [x, y];
    });
  };
  const linePairs = pairs(5);
  const areaPairs = pairs(12);
  const line = linePairs.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  if (!areaPairs.length) return { line, area: "" };
  const [firstX, firstY] = areaPairs[0];
  const [lastX] = areaPairs[areaPairs.length - 1];
  const commands = [`M${firstX.toFixed(1)},${firstY.toFixed(1)}`];
  areaPairs.slice(1).forEach(([x, y]) => commands.push(`L${x.toFixed(1)},${y.toFixed(1)}`));
  commands.push(`L${lastX.toFixed(1)},${height.toFixed(1)}`);
  commands.push(`L${firstX.toFixed(1)},${height.toFixed(1)} Z`);
  return { line, area: commands.join(" ") };
}

window.Innera = {
  LABELS,
  TITLES,
  TINTS,
  REPLIES,
  preferences,
  savePreferences,
  checkins,
  saveCheckin,
  metricEntries,
  saveMetric,
  goals,
  saveGoal,
  removeGoal,
  entries,
  saveEntry,
  removeEntry,
  sessions,
  saveSession,
  resetStore,
  toast,
  todayKey,
  dayOf,
  weekStart,
  inLastDays,
  stats,
  realSplit,
  formatDelta,
  labelFor,
  seriesPoints,
  uid,
};
