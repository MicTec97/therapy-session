const form = document.querySelector("#checkup-form");
const saved = document.querySelector("#checkup-saved");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const mood = form.mood.value;
  const effort = form.effort.value;
  const note = form.note.value.trim();
  if (!mood || !effort || !note) {
    return;
  }
  const checkups = readList(CHECKUPS_KEY);
  checkups.push({ mood, effort, note, at: new Date().toISOString() });
  writeJson(CHECKUPS_KEY, checkups);
  form.reset();
  saved.hidden = false;
});
