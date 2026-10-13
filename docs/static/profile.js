const form = document.querySelector("#profile-form");
const name = document.querySelector("#profile-name");
const demo = document.querySelector("#profile-demo");
const notify = document.querySelector("#profile-notify");
const time = document.querySelector("#profile-time");
const saved = document.querySelector("#profile-saved");
const hello = document.querySelector("#profile-hello");
const resetDialog = document.querySelector("#reset-dialog");

function fill() {
  const prefs = Innera.preferences();
  name.value = prefs.name;
  demo.checked = prefs.showDemo;
  notify.checked = prefs.notifications;
  time.value = prefs.notifyTime || "20:00";
  hello.textContent = prefs.name ? `Schön, dass du da bist, ${prefs.name}.` : "Schön, dass du da bist.";
}

fill();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const prefs = Innera.savePreferences({
    name: name.value.trim(),
    showDemo: demo.checked,
    notifications: notify.checked,
    notifyTime: time.value || "20:00",
  });
  fill();
  saved.textContent = prefs.notifications
    ? `Gespeichert. Eine Erinnerung um ${prefs.notifyTime} wird in dieser Demo nicht gesendet.`
    : "Gespeichert. Es wird keine Erinnerung gesendet.";
  Innera.toast("Profil gespeichert");
});

document.querySelector("#reset-open").addEventListener("click", () => resetDialog.showModal());

resetDialog.addEventListener("close", () => {
  if (resetDialog.returnValue !== "ok") return;
  Innera.resetStore();
  window.location.reload();
});
