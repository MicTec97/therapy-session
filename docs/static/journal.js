const list = document.querySelector("#entry-list");
const empty = document.querySelector("#entry-empty");
const dialog = document.querySelector("#entry-dialog");
const form = document.querySelector("#entry-form");
const hint = document.querySelector("#entry-hint");
const search = document.querySelector("#journal-search");
const removeButton = document.querySelector("#entry-delete");
let query = "";

function render() {
  const needle = query.trim().toLocaleLowerCase("de");
  const visible = Innera.entries().filter((entry) => {
    if (!needle) return true;
    const haystack = `${entry.title} ${entry.body} ${entry.tags.join(" ")}`.toLocaleLowerCase("de");
    return haystack.includes(needle);
  });
  list.replaceChildren();
  empty.hidden = Innera.entries().length > 0;
  if (!visible.length && Innera.entries().length) {
    const note = document.createElement("p");
    note.className = "empty";
    note.textContent = "Kein Eintrag passt zur Suche.";
    list.append(note);
  }
  visible.forEach((entry) => list.append(card(entry)));
}

function card(entry) {
  const article = document.createElement("article");
  article.className = "entry-card";
  const header = document.createElement("header");
  const heading = document.createElement("h3");
  heading.textContent = entry.title || "Ohne Überschrift";
  const when = document.createElement("time");
  when.className = "meta";
  when.dateTime = entry.at;
  when.textContent = new Date(entry.at).toLocaleDateString("de-AT", {
    day: "numeric",
    month: "long",
  });
  header.append(heading, when);
  const body = document.createElement("p");
  body.textContent = entry.body;
  article.append(header, body);
  if (entry.tags.length) {
    const tags = document.createElement("div");
    tags.className = "tags";
    entry.tags.forEach((tag) => {
      const chip = document.createElement("span");
      chip.className = "tag";
      chip.textContent = tag;
      tags.append(chip);
    });
    article.append(tags);
  }
  const row = document.createElement("div");
  row.className = "row";
  const edit = document.createElement("button");
  edit.type = "button";
  edit.className = "btn secondary";
  edit.textContent = "Bearbeiten";
  edit.addEventListener("click", () => open(entry));
  row.append(edit);
  article.append(row);
  return article;
}

function open(entry, draft = "") {
  hint.textContent = "";
  form.dataset.id = entry?.id || "";
  document.querySelector("#entry-dialog-title").textContent = entry ? "Eintrag bearbeiten" : "Neuer Eintrag";
  document.querySelector("#entry-title").value = entry?.title || "";
  document.querySelector("#entry-body").value = entry?.body || draft;
  document.querySelector("#entry-tags").value = entry?.tags?.join(", ") || "";
  removeButton.hidden = !entry;
  dialog.showModal();
}

document.querySelector("#entry-new").addEventListener("click", () => open(null));
document.querySelectorAll(".prompt").forEach((button) => {
  button.addEventListener("click", () => open(null, button.textContent.trim()));
});
document.querySelector("#entry-cancel").addEventListener("click", () => dialog.close());

removeButton.addEventListener("click", () => {
  if (!form.dataset.id || !window.confirm("Diesen Eintrag löschen?")) return;
  Innera.removeEntry(form.dataset.id);
  dialog.close();
  Innera.toast("Eintrag gelöscht");
  render();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const body = document.querySelector("#entry-body").value.trim();
  if (!body) {
    hint.textContent = "Schreib wenigstens einen Satz.";
    return;
  }
  const existing = Innera.entries().find((entry) => entry.id === form.dataset.id);
  Innera.saveEntry({
    id: form.dataset.id || Innera.uid(),
    title: document.querySelector("#entry-title").value.trim(),
    body,
    tags: document.querySelector("#entry-tags").value.split(",").map((tag) => tag.trim()).filter(Boolean),
    at: existing?.at,
    day: existing?.day,
    source: existing?.source || "tagebuch",
  });
  dialog.close();
  Innera.toast("Eintrag gespeichert");
  render();
});

search.addEventListener("input", () => {
  query = search.value;
  render();
});

render();
