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
