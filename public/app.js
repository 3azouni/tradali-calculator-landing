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
