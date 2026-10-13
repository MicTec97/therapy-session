(() => {
const list = document.querySelector("#week-goals");
const empty = document.querySelector("#week-empty");
const done = document.querySelector("#week-done");
const start = Innera.todayKey(Innera.weekStart());

const active = Innera.goals().filter((goal) => goal.status !== "done");
empty.hidden = active.length > 0;
active.forEach((goal) => {
  const article = document.createElement("article");
  article.className = "goal-card";
  const heading = document.createElement("h3");
  heading.textContent = goal.title;
  const meta = document.createElement("p");
  meta.className = "meta";
  const count = (goal.attended || []).filter((day) => day >= start).length;
  meta.textContent = goal.status === "paused" ? "Pausiert" : `${goal.frequency}${count ? ` · ${count} mal beachtet` : ""}`;
  const link = document.createElement("a");
  link.className = "btn secondary";
  link.href = Innera.path("/ziele");
  link.textContent = "Zum Ziel";
  article.append(heading, meta, link);
  list.append(article);
});

const finished = Innera.sessions().filter((item) => item.completed && Innera.dayOf(item.endedAt) >= start);
done.textContent = finished.length
  ? `${finished.length} Übung${finished.length === 1 ? "" : "en"} diese Woche beendet.`
  : "Noch keine Übung diese Woche beendet.";
})();
