const btnArea = document.getElementById("btnArea");
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const card = document.getElementById("card");

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function rectCenter(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
}

function moveNoButtonAway(pointerX, pointerY) {
  const areaRect = btnArea.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();

  const c = rectCenter(noBtn);
  const dx = pointerX - c.x;
  const dy = pointerY - c.y;
  const dist = Math.hypot(dx, dy);

  const trigger = 90;
  if (dist > trigger) return;

  const padding = 10;

  const maxX = areaRect.width - noRect.width - padding;
  const maxY = areaRect.height - noRect.height - padding;

  for (let i = 0; i < 12; i++) {
    const x = padding + Math.random() * maxX;
    const y = padding + Math.random() * maxY;

    const candidate = {
      left: areaRect.left + x,
      top: areaRect.top + y,
      right: areaRect.left + x + noRect.width,
      bottom: areaRect.top + y + noRect.height,
    };

    const yes = yesRect;
    const overlap =
      !(candidate.right < yes.left ||
        candidate.left > yes.right ||
        candidate.bottom < yes.top ||
        candidate.top > yes.bottom);

    if (!overlap) {
      noBtn.style.left = `${x}px`;
      noBtn.style.top = `${y}px`;
      noBtn.style.transform = `translate(0, 0)`;
      return;
    }
  }

  noBtn.style.left = `${maxX}px`;
  noBtn.style.top = `${padding}px`;
  noBtn.style.transform = `translate(0, 0)`;
}

btnArea.addEventListener("mousemove", (e) => {
  moveNoButtonAway(e.clientX, e.clientY);
});

btnArea.addEventListener(
  "touchstart",
  (e) => {
    const t = e.touches[0];
    moveNoButtonAway(t.clientX, t.clientY);
  },
  { passive: true }
);

noBtn.addEventListener("mouseenter", () => {
  const c = rectCenter(noBtn);
  moveNoButtonAway(c.x - 30, c.y - 30);
});

/* ---------------- Celebration Screen ---------------- */

function launchCelebration() {
  // Replace the card with a celebration screen
  card.innerHTML = `
    <div class="celebrate">
      <h1 class="celebrate-title">YAYYY 💖</h1>
      <p class="celebrate-sub">Isabel said yes 😈</p>
      <p class="celebrate-sub2">Happy Valentine’s Day 💘</p>
      <button class="btn yes celebrate-btn" id="restartBtn">Replay</button>
    </div>

    <div class="float-layer" id="floatLayer"></div>
  `;

  const layer = document.getElementById("floatLayer");

  // hearts + sparkles
  const emojis = ["💖", "💘", "💕", "💗", "✨", "❤️"];

  function spawnPiece() {
    const el = document.createElement("div");
    el.className = "floaty";
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const left = Math.random() * 100; // %
    const size = 16 + Math.random() * 22; // px
    const drift = (Math.random() * 80 - 40).toFixed(0); // px
    const dur = (2.5 + Math.random() * 2.5).toFixed(2); // seconds
    const delay = (Math.random() * 0.5).toFixed(2);

    el.style.left = `${left}%`;
    el.style.fontSize = `${size}px`;
    el.style.setProperty("--drift", `${drift}px`);
    el.style.animationDuration = `${dur}s`;
    el.style.animationDelay = `${delay}s`;

    layer.appendChild(el);

    // cleanup
    setTimeout(() => el.remove(), (parseFloat(dur) + parseFloat(delay)) * 1000);
  }

  // burst
  for (let i = 0; i < 35; i++) setTimeout(spawnPiece, i * 35);

  // continuous sprinkle
  const interval = setInterval(spawnPiece, 140);

  // Replay button
  document.getElementById("restartBtn").addEventListener("click", () => {
    clearInterval(interval);
    location.reload();
  });
}

yesBtn.addEventListener("click", launchCelebration);
