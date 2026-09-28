const faqRoot = document.getElementById("faq-list");
if (faqRoot) {
  faqRoot.addEventListener("click", (event) => {
    const button = event.target.closest(".faq-q");
    if (!button || !faqRoot.contains(button)) return;

    const item = button.closest(".faq-item");
    if (!item) return;
    const wasOpen = item.classList.contains("open");

    faqRoot.querySelectorAll(".faq-item").forEach((el) => {
      el.classList.remove("open");
      el.querySelector(".faq-q")?.setAttribute("aria-expanded", "false");
    });

    if (!wasOpen) {
      item.classList.add("open");
      button.setAttribute("aria-expanded", "true");
    }
  });
}

(function initTesterProgress() {
  const KEY = "ratepocket_tester_progress_v4";
  const steps = ["list", "install", "feedback"];
  const progressEl = document.getElementById("tester-progress");
  if (!progressEl) return;

  let state = { list: false, install: false, feedback: false };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...state, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }

  const paint = () => {
    progressEl.hidden = false;
    steps.forEach((id) => {
      const trackItem = progressEl.querySelector(`[data-step="${id}"]`);
      const card = document.querySelector(`[data-tester-step="${id}"]`);
      const done = Boolean(state[id]);
      trackItem?.classList.toggle("done", done);
      card?.classList.toggle("is-done", done);
    });
  };

  const mark = (id) => {
    if (!steps.includes(id)) return;
    state[id] = true;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
    paint();
  };

  document.querySelectorAll("[data-tester-cta]").forEach((el) => {
    el.addEventListener("click", () => {
      const id = el.getAttribute("data-tester-cta");
      if (id) mark(id);
    });
  });

  paint();
})();

/**
 * Winners wheel — display only.
 * Edit SELECTED_TESTERS when the team adds verified closed testers.
 * Empty list shows open-seat placeholders. Preview spin is not an official draw.
 */
(function initWinnersWheel() {
  /** @type {string[]} Team-curated display names for selected testers (edit manually). */
  const SELECTED_TESTERS = [];

  const PLACEHOLDER_LABELS = [
    "Open seat",
    "Pending review",
    "Open seat",
    "Pending review",
    "Open seat",
    "Pending review",
  ];

  const COLORS = [
    "#7c6ff0",
    "#5b4fd1",
    "#f2c438",
    "#c9a227",
    "#3d3a55",
    "#9b8cff",
    "#e8b923",
    "#4a4680",
  ];

  const canvas = document.getElementById("winners-wheel");
  const caption = document.getElementById("wheel-caption");
  const roster = document.getElementById("wheel-roster");
  const spinBtn = document.getElementById("wheel-preview-spin");
  if (!canvas || !(canvas instanceof HTMLCanvasElement)) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const labels =
    SELECTED_TESTERS.length > 0
      ? SELECTED_TESTERS
      : PLACEHOLDER_LABELS;
  const hasSelected = SELECTED_TESTERS.length > 0;

  if (roster) {
    roster.innerHTML = "";
    SELECTED_TESTERS.forEach((name) => {
      const li = document.createElement("li");
      li.textContent = name;
      roster.appendChild(li);
    });
  }

  if (caption) {
    caption.textContent = hasSelected
      ? `${SELECTED_TESTERS.length} selected tester${SELECTED_TESTERS.length === 1 ? "" : "s"} on the wheel — official results still posted by the team.`
      : "Idle preview — open seats until we add selected testers after review.";
  }

  let rotation = 0;
  let spinning = false;
  let idle = true;
  let raf = 0;
  let lastTs = 0;

  const draw = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssSize = canvas.clientWidth || 420;
    const size = Math.round(cssSize * dpr);
    if (canvas.width !== size || canvas.height !== size) {
      canvas.width = size;
      canvas.height = size;
    }

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 4 * dpr;
    const n = Math.max(labels.length, 2);
    const slice = (Math.PI * 2) / n;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);

    for (let i = 0; i < n; i += 1) {
      const start = i * slice - Math.PI / 2;
      const end = start + slice;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = "rgba(13,13,13,0.55)";
      ctx.lineWidth = 2 * dpr;
      ctx.stroke();

      ctx.save();
      ctx.rotate(start + slice / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = i % 2 === 0 ? "#f5f3ff" : "#1a1408";
      ctx.font = `700 ${Math.max(11, Math.round(size * 0.038))}px "Plus Jakarta Sans", system-ui, sans-serif`;
      const text = labels[i].length > 16 ? `${labels[i].slice(0, 14)}…` : labels[i];
      ctx.fillText(text, radius - 14 * dpr, 5 * dpr);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(242,196,56,0.65)";
    ctx.lineWidth = 4 * dpr;
    ctx.stroke();
    ctx.restore();
  };

  const tick = (ts) => {
    if (!lastTs) lastTs = ts;
    const dt = Math.min(32, ts - lastTs);
    lastTs = ts;
    if (idle && !spinning) {
      rotation += (dt / 1000) * 0.35;
    }
    draw();
    raf = requestAnimationFrame(tick);
  };

  const preferReduced =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  draw();
  if (!preferReduced) {
    raf = requestAnimationFrame(tick);
  }

  if (spinBtn) {
    spinBtn.addEventListener("click", () => {
      if (spinning) return;
      spinning = true;
      idle = false;
      const start = rotation;
      const extra = Math.PI * 2 * (4 + Math.random() * 3) + Math.random() * Math.PI * 2;
      const duration = 3200;
      const t0 = performance.now();

      const animateSpin = (now) => {
        const t = Math.min(1, (now - t0) / duration);
        const ease = 1 - Math.pow(1 - t, 3);
        rotation = start + extra * ease;
        draw();
        if (t < 1) {
          requestAnimationFrame(animateSpin);
          return;
        }
        spinning = false;
        idle = !preferReduced;
        if (caption) {
          caption.textContent = hasSelected
            ? "Preview only — official winners are posted by the team on this page."
            : "Preview only — no winner picked. Selected testers will appear here after review.";
        }
      };

      requestAnimationFrame(animateSpin);
    });
  }

  window.addEventListener(
    "resize",
    () => {
      draw();
    },
    { passive: true }
  );

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
      lastTs = 0;
    } else if (!preferReduced && !raf) {
      raf = requestAnimationFrame(tick);
    }
  });
})();
