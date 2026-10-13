const form = document.querySelector("#reflect-form");
const body = document.querySelector("#reflect-body");
const hint = document.querySelector("#reflect-hint");
const question = document.querySelector("#reflect-question");
const done = document.querySelector("#reflect-done");

document.querySelectorAll(".prompt").forEach((button) => {
  button.addEventListener("click", () => {
    question.textContent = button.textContent.trim();
    body.focus();
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = body.value.trim();
  if (!text) {
    hint.textContent = "Schreib ein paar Worte, oder lass die Frage einfach stehen.";
    return;
  }
  hint.textContent = "";
  Innera.saveEntry({
    title: question.textContent.trim(),
    body: text,
    tags: ["reflexion"],
    source: "reflexion",
  });
  body.value = "";
  done.textContent = "Im Tagebuch gesichert.";
  Innera.toast("Reflexion gespeichert");
});
