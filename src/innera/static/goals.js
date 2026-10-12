const list = document.querySelector("#goal-list");
const form = document.querySelector("#goal-form");

function progressFor(checkups) {
  const score = checkups.reduce((total, checkup) => {
    if (checkup.effort === "Ja") {
      return total + 34;
    }
    if (checkup.effort === "Ein bisschen") {
      return total + 16;
    }
    return total;
  }, 0);
  return Math.min(score, 100);
}

function renderGoals() {
  const goals = readList(GOALS_KEY);
  const checkups = readList(CHECKUPS_KEY);
  const progress = progressFor(checkups);
  list.replaceChildren();
  if (!goals.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "Noch keine Ziele. Leg fest, woran du arbeiten willst.";
    list.append(empty);
    return;
  }
  for (const goal of goals) {
    const article = document.createElement("article");
    article.className = "goal";
    const title = document.createElement("h3");
    title.textContent = goal.area;
    const text = document.createElement("p");
    text.textContent = goal.text;
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.setAttribute("role", "meter");
    bar.setAttribute("aria-label", `Fortschritt ${goal.area}`);
    bar.setAttribute("aria-valuenow", String(progress));
    const fill = document.createElement("span");
    fill.style.width = `${progress}%`;
    bar.append(fill);
    const label = document.createElement("p");
    label.className = "delta";
    label.textContent = `${progress}% aus deinen Check-ups`;
    article.append(title, text, bar, label);
    list.append(article);
  }
}

const goalHint = document.querySelector("#goal-hint");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const areas = [...form.querySelectorAll('input[name="area"]:checked')].map((box) => box.value);
  if (!areas.length) {
    goalHint.hidden = false;
    return;
  }
  const typed = form.querySelector('[name="goal"]').value.trim();
  const text = typed || "Ich möchte daran arbeiten.";
  upsertGoals(areas.map((area) => ({ area, text })));
  goalHint.hidden = true;
  form.reset();
  renderGoals();
});

renderGoals();
