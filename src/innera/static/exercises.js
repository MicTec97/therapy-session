const phase = document.querySelector("#breath-phase");
const orb = document.querySelector("#breath-orb");
const start = document.querySelector("#breath-start");
const pause = document.querySelector("#breath-pause");
const stop = document.querySelector("#breath-stop");

if (orb) {
  const steps = [
    { name: "Einatmen", phase: "in", ms: 4000 },
    { name: "Halten", phase: "hold", ms: 2000 },
    { name: "Ausatmen", phase: "out", ms: 6000 },
  ];
  let timer = null;
  let index = 0;
  let mode = "idle";
  let startedAt = null;

  function show(step) {
    phase.textContent = step.name;
    orb.dataset.phase = step.phase;
  }

  function tick() {
    const step = steps[index % steps.length];
    show(step);
    timer = window.setTimeout(() => {
      index += 1;
      tick();
    }, step.ms);
  }

  function setMode(next) {
    mode = next;
    start.disabled = next === "running";
    pause.disabled = next === "idle";
    stop.disabled = next === "idle";
    pause.textContent = next === "paused" ? "Fortsetzen" : "Pause";
  }

  start.addEventListener("click", () => {
    if (mode === "paused") {
      setMode("running");
      tick();
      return;
    }
    startedAt = new Date().toISOString();
    index = 0;
    setMode("running");
    tick();
  });

  pause.addEventListener("click", () => {
    if (mode === "running") {
      window.clearTimeout(timer);
      setMode("paused");
      phase.textContent = "Pause";
      return;
    }
    if (mode === "paused") {
      setMode("running");
      tick();
    }
  });

  stop.addEventListener("click", () => {
    window.clearTimeout(timer);
    if (startedAt) {
      Innera.saveSession({ kind: "atmen", startedAt, completed: true });
    }
    startedAt = null;
    index = 0;
    setMode("idle");
    phase.textContent = "Beendet";
    orb.dataset.phase = "idle";
    document.querySelector("#breath-note").textContent = "Beendet. Danke, dass du dir die Zeit genommen hast.";
    Innera.toast("Atemübung beendet");
  });
}

const bodyForm = document.querySelector("#body-form");
if (bodyForm) {
  const steps = [...bodyForm.querySelectorAll(".step")];
  let index = 0;
  const startedAt = new Date().toISOString();

  function show(next) {
    index = next;
    steps.forEach((step, stepIndex) => {
      step.hidden = stepIndex !== index;
    });
  }

  bodyForm.querySelectorAll(".next, .step-skip").forEach((button) => {
    button.addEventListener("click", () => show(Math.min(index + 1, steps.length - 1)));
  });

  bodyForm.querySelector(".finish").addEventListener("click", () => {
    steps.forEach((step) => {
      step.hidden = true;
    });
    document.querySelector("#body-done").hidden = false;
    document.querySelector("#body-save").hidden = false;
    Innera.saveSession({ kind: "koerper", startedAt, completed: true });
  });

  document.querySelector("#body-save").addEventListener("click", () => {
    const lines = steps
      .map((step) => {
        const question = step.querySelector("legend").textContent;
        const answer = step.querySelector("textarea").value.trim();
        return answer ? `${question}\n${answer}` : "";
      })
      .filter(Boolean);
    if (!lines.length) {
      document.querySelector("#body-done").textContent = "Nichts zum Sichern. Das ist in Ordnung.";
      return;
    }
    Innera.saveEntry({
      title: "Body-Check-in",
      body: lines.join("\n\n"),
      tags: ["körper"],
      source: "uebung",
    });
    document.querySelector("#body-done").textContent = "Im Tagebuch gesichert.";
    Innera.toast("Im Tagebuch gesichert");
  });
}

const thoughts = document.querySelector("#thoughts-form");
if (thoughts) {
  const startedAt = new Date().toISOString();
  thoughts.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = [
      ["Was beschäftigt mich?", thoughts.elements.busy.value.trim()],
      ["Was kann ich beeinflussen?", thoughts.elements.influence.value.trim()],
      ["Was brauche ich gerade?", thoughts.elements.need.value.trim()],
    ].filter(([, value]) => value);
    const hint = document.querySelector("#thoughts-hint");
    if (!fields.length) {
      hint.textContent = "Schreib wenigstens in ein Feld, oder geh ohne Speichern zurück.";
      return;
    }
    hint.textContent = "";
    const body = fields.map(([label, value]) => `${label}\n${value}`).join("\n\n");
    Innera.saveEntry({ title: "Gedanken sortieren", body, tags: ["gedanken"], source: "uebung" });
    Innera.saveSession({ kind: "gedanken", startedAt, completed: true });
    document.querySelector("#thoughts-done").textContent = "Gesichert. Du findest den Eintrag im Tagebuch.";
    Innera.toast("Im Tagebuch gesichert");
    thoughts.reset();
  });
}
