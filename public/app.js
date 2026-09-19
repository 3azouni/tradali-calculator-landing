const PLAY_URL =
  "https://play.google.com/apps/testing/com.tradali.calculator";

const FAQS = [
  {
    q: "How do I try RatePocket?",
    a: `Join the Android closed testing on Google Play: <a href="${PLAY_URL}" target="_blank" rel="noopener noreferrer">play.google.com/apps/testing/com.tradali.calculator</a>. Accept the tester invite, then install from the Play Store listing.`,
  },
  {
    q: "Is RatePocket free?",
    a: "Yes — the calculator, converter, and spending tracker are free to use, with ads. Exporting as PDF/CSV is $0.99 per export, free with a rewarded video, or unlimited with the one-time $6.99 Lifetime Export Pass. Optional Cloud Backup is a separate subscription and uses Google sign-in.",
  },
  {
    q: "What currencies are supported?",
    a: "152 currencies, with live rates. Search by currency code or country to find any pair.",
  },
  {
    q: "Which platforms is it available on?",
    a: "Android only right now. Closed testing is open via Google Play — use the Join testing button on this page.",
  },
  {
    q: "Does the Lifetime Export Pass remove ads?",
    a: "No — it only removes the export paywall. Advertising remains enabled in the app.",
  },
  {
    q: "What is Cloud Backup?",
    a: "Cloud Backup is an optional Google Play subscription ($1.99/month or $14.99/year). After you subscribe and sign in with Google, RatePocket can back up and sync your spending history, restore it on a new phone, unlock unlimited exports, raise the group limit to 14, and include extra stats. Ads stay on. Cancel anytime in Google Play.",
  },
  {
    q: "How does AI receipt scan work?",
    a: "When adding a spend, you can scan a bill with the camera or pick a photo from your gallery. RatePocket reads the line items so you can edit them, then adds each item as a spend. Free installs get 5 lifetime scans. Cloud Backup subscribers get 100 scans per calendar month.",
  },
  {
    q: "How does the salary period work?",
    a: "Set a salary or budget once, then choose a calendar month or your own custom day-to-day range. Every spend you log is timestamped and comes straight off the balance.",
  },
  {
    q: "How do I delete my account or data?",
    a: 'Core features work without an account. If you used Cloud Backup (Google sign-in), request deletion at the <a href="delete-account/">Delete account</a> page or email support.tradali@gmail.com. Local-only data can be removed by clearing app storage or uninstalling.',
  },
];

function renderFaqs() {
  const root = document.getElementById("faq-list");
  if (!root) return;

  root.innerHTML = FAQS.map(
    (item, index) => `
    <div class="faq-item${index === 0 ? " open" : ""}" data-index="${index}">
      <button type="button" class="faq-q" aria-expanded="${index === 0}">
        <span>${item.q}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9AA0AC" stroke-width="2.4" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="faq-a"><div class="faq-a-inner">${item.a}</div></div>
    </div>`
  ).join("");

  root.addEventListener("click", (event) => {
    const button = event.target.closest(".faq-q");
    if (!button) return;

    const item = button.closest(".faq-item");
    const wasOpen = item.classList.contains("open");

    root.querySelectorAll(".faq-item").forEach((el) => {
      el.classList.remove("open");
      el.querySelector(".faq-q")?.setAttribute("aria-expanded", "false");
    });

    if (!wasOpen) {
      item.classList.add("open");
      button.setAttribute("aria-expanded", "true");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderFaqs();
});
