const MOOD_SCORE = { Schwer: 1, Okay: 2, Gut: 3, "Sehr gut": 4 };

const summary = document.querySelector("#insight-summary");
const caption = document.querySelector("#insight-caption");
const line = document.querySelector("#insight-line");

function sparkline(values) {
  const width = 120;
  const height = 36;
  const low = Math.min(...values);
  const high = Math.max(...values);
  const span = high - low || 1;
  const step = width / (values.length - 1);
  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - ((value - low) / span) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

const checkups = readList(CHECKUPS_KEY);
if (checkups.length === 1) {
  summary.textContent = `1 Check-up · ${checkups[0].mood}`;
  caption.textContent = "Aus deinen Check-ups";
} else if (checkups.length >= 2) {
  const scores = checkups.map((checkup) => MOOD_SCORE[checkup.mood] || 2);
  const first = scores[0];
  const last = scores[scores.length - 1];
  const change = Math.round(((last - first) / first) * 100);
  const direction = change >= 0 ? `+${change}%` : `${change}%`;
  summary.textContent = `${direction} über ${checkups.length} Check-ups`;
  caption.textContent = "Aus deinen Check-ups";
  line.setAttribute("points", sparkline(scores));
}
