const thread = document.querySelector("#thread");
const scroller = document.querySelector(".chat-body");
const form = document.querySelector("#composer");
const input = document.querySelector("#message");
const impulses = document.querySelector("#impulses");
const summaryDialog = document.querySelector("#summary-dialog");
const freshDialog = document.querySelector("#fresh-dialog");
const summaryForm = document.querySelector("#summary-form");

let sending = false;

function stamp(node) {
  const time = node.querySelector("time");
  if (time && !time.textContent) {
    time.textContent = new Date().toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit" });
  }
}

thread.querySelectorAll(".bubble").forEach(stamp);

function appendMessage(role, text, options = {}) {
  const article = document.createElement("article");
  article.className = `bubble ${role}`;
  if (options.pending) article.classList.add("pending");
  if (options.crisis) article.classList.add("crisis");
  const body = document.createElement("div");
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  const time = document.createElement("time");
  time.dateTime = new Date().toISOString();
  time.textContent = new Date().toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit" });
  body.append(paragraph, time);
  if (role === "assistant") {
    const image = document.createElement("img");
    image.src = "/static/avatar.jpg";
    image.alt = "";
    article.append(image, body);
  } else {
    article.append(body);
  }
  thread.append(article);
  if (scroller) scroller.scrollTop = scroller.scrollHeight;
  return article;
}

function history() {
  return [...thread.querySelectorAll(".bubble:not(.pending)")].map((bubble) => ({
    role: bubble.classList.contains("user") ? "user" : "assistant",
    text: bubble.querySelector("p")?.textContent || "",
  }));
}

function resize() {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
}

input.addEventListener("input", resize);

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

impulses.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.textContent.trim();
    resize();
    input.focus();
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text || sending) return;
  const prior = history();
  appendMessage("user", text);
  input.value = "";
  resize();
  impulses.hidden = true;
  sending = true;
  input.disabled = true;
  form.querySelector("button").disabled = true;
  const pending = appendMessage("assistant", "Ich lese gerade.", { pending: true });
  try {
    const response = await fetch("/api/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, goals: Innera.goals(), history: prior }),
    });
    if (!response.ok) throw new Error("reply failed");
    const payload = await response.json();
    pending.remove();
    appendMessage("assistant", payload.reply || "Ich konnte gerade nicht antworten. Versuch es noch einmal.", {
      crisis: Boolean(payload.crisis),
    });
  } catch (error) {
    pending.remove();
    appendMessage("assistant", "Ich konnte gerade nicht antworten. Versuch es noch einmal.");
  }
  sending = false;
  input.disabled = false;
  form.querySelector("button").disabled = false;
  input.focus();
});

function lastUserText() {
  const notes = [...thread.querySelectorAll(".bubble.user p")];
  return notes.length ? notes[notes.length - 1].textContent : "";
}

document.querySelector("#summary-open").addEventListener("click", () => {
  document.querySelector("#sum-was").value = lastUserText();
  summaryDialog.showModal();
});

summaryForm.addEventListener("submit", (event) => {
  const choice = event.submitter?.value;
  if (choice !== "save") return;
  const fields = [
    ["Was mich beschäftigt", document.querySelector("#sum-was").value],
    ["Gefühle", document.querySelector("#sum-gefuehle").value],
    ["Gedanken", document.querySelector("#sum-gedanken").value],
    ["Was ich mitnehme", document.querySelector("#sum-mitnehmen").value],
    ["Nächster Schritt", document.querySelector("#sum-schritt").value],
  ].filter(([, value]) => value.trim());
  if (!fields.length) {
    event.preventDefault();
    Innera.toast("Nichts zum Speichern");
    return;
  }
  const body = fields.map(([label, value]) => `${label}\n${value.trim()}`).join("\n\n");
  Innera.saveEntry({ title: "Gespräch", body, tags: ["gespräch"], source: "gespraech" });
  Innera.toast("Zusammenfassung im Tagebuch");
});

function resetThread() {
  thread.replaceChildren();
  appendMessage("assistant", thread.dataset.opening);
  impulses.hidden = false;
  summaryForm.reset();
}

document.querySelector("#fresh").addEventListener("click", () => {
  if (!thread.querySelector(".bubble.user")) {
    resetThread();
    return;
  }
  freshDialog.showModal();
});

freshDialog.addEventListener("close", () => {
  if (freshDialog.returnValue === "ok") resetThread();
});
