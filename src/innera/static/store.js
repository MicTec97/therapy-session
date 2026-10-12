const GOALS_KEY = "innera.goals";
const CHECKUPS_KEY = "innera.checkups";

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

function upsertGoals(entries) {
  const current = readList(GOALS_KEY);
  const byArea = new Map(current.map((goal) => [goal.area, goal]));
  for (const entry of entries) {
    byArea.set(entry.area, entry);
  }
  const goals = [...byArea.values()];
  writeJson(GOALS_KEY, goals);
  return goals;
}
