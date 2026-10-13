const list = document.querySelector("#goal-list");
const doneList = document.querySelector("#goal-done");
const empty = document.querySelector("#goal-empty");
const dialog = document.querySelector("#goal-dialog");
const form = document.querySelector("#goal-form");
const hint = document.querySelector("#goal-hint");
const titleInput = document.querySelector("#goal-title");

const TARGETS = {
  Täglich: 7,
  "Mehrmals pro Woche": 3,
  Wöchentlich: 1,
};

function weekCount(goal) {
  const start = Innera.todayKey(Innera.weekStart());
  return (goal.attended || []).filter((day) => day >= start).length;
}

function render() {
  const all = Innera.goals();
  const active = all.filter((goal) => goal.status !== "done");
  const finished = all.filter((goal) => goal.status === "done");
  list.replaceChildren();
  doneList.replaceChildren();
  empty.hidden = active.length > 0;
  document.querySelector("#done-goals").closest("section").hidden = finished.length === 0;
  active.forEach((goal) => list.append(card(goal)));
  finished.forEach((goal) => doneList.append(card(goal)));
}

function card(goal) {
  const article = document.createElement("article");
  article.className = `goal-card${goal.status === "paused" ? " paused" : ""}${goal.status === "done" ? " done" : ""}`;
  const header = document.createElement("header");
  const heading = document.createElement("h3");
  heading.textContent = goal.title;
  const area = document.createElement("span");
  area.className = "badge";
  area.textContent = goal.area;
  header.append(heading, area);
  const description = document.createElement("p");
  description.textContent = goal.description;
  const meta = document.createElement("p");
  meta.className = "meta";
  const target = TARGETS[goal.frequency] || 0;
  const count = weekCount(goal);
  meta.textContent = target ? `${goal.frequency} · ${count} von ${target} diese Woche` : `${goal.frequency} · in deinem Tempo`;
  article.append(header);
  if (goal.description) article.append(description);
  article.append(meta);
  if (target && goal.status === "active") {
    const meter = document.createElement("div");
    meter.className = "meter";
    meter.setAttribute("role", "progressbar");
    meter.setAttribute("aria-valuemin", "0");
    meter.setAttribute("aria-valuemax", String(target));
    meter.setAttribute("aria-valuenow", String(Math.min(count, target)));
    const bar = document.createElement("span");
    bar.style.width = `${Math.min(100, (count / target) * 100)}%`;
    meter.append(bar);
    article.append(meter);
  }
  const row = document.createElement("div");
  row.className = "row";
  if (goal.status !== "done") {
    row.append(action(goal.attended.includes(Innera.todayKey()) ? "Heute zurücknehmen" : "Heute beachtet", () => {
      const day = Innera.todayKey();
      const attended = goal.attended.includes(day)
        ? goal.attended.filter((item) => item !== day)
        : [...goal.attended, day];
      Innera.saveGoal({ ...goal, attended });
      render();
    }));
    row.append(action("Bearbeiten", () => open(goal)));
    row.append(action(goal.status === "paused" ? "Fortsetzen" : "Pausieren", () => {
      Innera.saveGoal({ ...goal, status: goal.status === "paused" ? "active" : "paused" });
      render();
    }));
    row.append(action("Abschließen", () => {
      Innera.saveGoal({ ...goal, status: "done" });
      Innera.toast("Ziel abgeschlossen");
      render();
    }));
  } else {
    row.append(action("Wieder aufnehmen", () => {
      Innera.saveGoal({ ...goal, status: "active" });
      render();
    }));
  }
  row.append(action("Löschen", () => {
    if (!window.confirm("Dieses Ziel löschen?")) return;
    Innera.removeGoal(goal.id);
    render();
  }, "quiet"));
  article.append(row);
  return article;
}

function action(label, onClick, kind = "secondary") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `btn ${kind}`;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function open(goal) {
  hint.textContent = "";
  form.dataset.id = goal?.id || "";
  document.querySelector("#goal-dialog-title").textContent = goal && goal.id ? "Ziel bearbeiten" : "Neues Ziel";
  titleInput.value = goal?.title || "";
  document.querySelector("#goal-description").value = goal?.description || "";
  document.querySelector("#goal-area").value = goal?.area || "Karriere";
  document.querySelector("#goal-frequency").value = goal?.frequency || "Wenn es passt";
  document.querySelector("#goal-start").value = goal?.start || Innera.todayKey();
  document.querySelector("#goal-end").value = goal?.end || "";
  dialog.showModal();
}

document.querySelector("#goal-new").addEventListener("click", () => open(null));
document.querySelectorAll(".suggest").forEach((button) => {
  button.addEventListener("click", () => {
    open({
      title: button.dataset.title,
      area: button.dataset.area,
      frequency: button.dataset.frequency,
      start: Innera.todayKey(),
    });
  });
});

document.querySelector("#goal-cancel").addEventListener("click", () => dialog.close());

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  if (!title) {
    hint.textContent = "Gib dem Ziel einen kurzen Titel.";
    titleInput.focus();
    return;
  }
  const start = document.querySelector("#goal-start").value;
  const end = document.querySelector("#goal-end").value;
  if (end && start && end < start) {
    hint.textContent = "Das Ende liegt vor dem Beginn.";
    return;
  }
  const existing = Innera.goals().find((goal) => goal.id === form.dataset.id);
  Innera.saveGoal({
    id: form.dataset.id || Innera.uid(),
    title,
    description: document.querySelector("#goal-description").value.trim(),
    area: document.querySelector("#goal-area").value,
    frequency: document.querySelector("#goal-frequency").value,
    start,
    end,
    status: existing?.status || "active",
    attended: existing?.attended || [],
  });
  dialog.close();
  Innera.toast("Ziel gespeichert");
  render();
});

render();
