const thread = document.querySelector("#thread");
const form = document.querySelector("#composer");
const input = document.querySelector("#message");
const welcome = document.querySelector("#welcome");
const welcomeForm = document.querySelector("#welcome-form");
const toggle = document.querySelector("#session-toggle");
const status = document.querySelector("#session-status");

const sessionMs = Number(thread.dataset.minutes) * 60 * 1000;
let startedAt = null;
let timer = null;

function appendMessage(role, text) {
  const article = document.createElement("article");
  article.className = `bubble ${role}`;
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  article.append(paragraph);
  thread.append(article);
  thread.scrollTop = thread.scrollHeight;
}

function renderStatus() {
  const left = Math.max(0, sessionMs - (Date.now() - startedAt));
  const mins = Math.ceil(left / 60000);
  status.textContent = `Läuft · noch ${mins} Min.`;
  if (left === 0) {
    endSession();
  }
}

function endSession() {
  window.clearInterval(timer);
  timer = null;
  const elapsed = startedAt ? Date.now() - startedAt : 0;
  const mins = Math.round(elapsed / 60000);
  status.textContent = mins < 1 ? "Beendet" : `Beendet · ${mins} Min.`;
  toggle.disabled = true;
  input.disabled = true;
  appendMessage("assistant", thread.dataset.closing);
  startedAt = null;
}

if (!readJson(GOALS_KEY)) {
  welcome.classList.add("is-open");
  document.body.classList.add("choosing-goals");
}

const welcomeHint = document.querySelector("#welcome-hint");

function saveWelcome(event) {
  event.preventDefault();
  const areas = [...welcomeForm.querySelectorAll('input[name="area"]:checked')].map((box) => box.value);
  if (!areas.length) {
    welcomeHint.hidden = false;
    return;
  }
  const typed = welcomeForm.querySelector('[name="goal"]').value.trim();
  const text = typed || "Ich möchte daran arbeiten.";
  upsertGoals(areas.map((area) => ({ area, text })));
  welcome.classList.remove("is-open");
  document.body.classList.remove("choosing-goals");
}

welcomeForm.addEventListener("submit", saveWelcome);

toggle.addEventListener("click", () => {
  if (startedAt) {
    endSession();
    return;
  }
  startedAt = Date.now();
  input.disabled = false;
  toggle.textContent = "Beenden";
  status.textContent = `Läuft · noch ${thread.dataset.minutes} Min.`;
  appendMessage("assistant", thread.dataset.opening);
  timer = window.setInterval(renderStatus, 1000);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text || !startedAt) {
    return;
  }
  const history = [...thread.querySelectorAll(".bubble")].map((bubble) => ({
    role: bubble.classList.contains("user") ? "user" : "assistant",
    text: bubble.querySelector("p")?.textContent || "",
  }));
  appendMessage("user", text);
  input.value = "";
  input.disabled = true;
  try {
    const response = await fetch("/api/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, goals: readList(GOALS_KEY), history }),
    });
    if (!response.ok) {
      throw new Error("reply failed");
    }
    const payload = await response.json();
    appendMessage("assistant", payload.reply || "Ich konnte gerade nicht antworten. Versuch es noch einmal.");
  } catch (error) {
    appendMessage("assistant", "Ich konnte gerade nicht antworten. Versuch es noch einmal.");
  }
  if (startedAt) {
    input.disabled = false;
  }
});
