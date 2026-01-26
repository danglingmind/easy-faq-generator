document.addEventListener("click", (e) => {
    const button = e.target.closest("[data-accordion-button]");
    if (!button) return;
  
    const item = button.closest(".faq-item");
    if (!item) return;
  
    item.style.transition = "border-color 300ms ease";
  });