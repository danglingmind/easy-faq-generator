(function () {
  function getConfig(container) {
    const type = container.getAttribute("data-animation-type") || "Fade";
    const duration = parseInt(container.getAttribute("data-animation-duration") || "300", 10);
    const mode = container.getAttribute("data-accordion-mode") || "single";
    return { type, duration, mode };
  }

  function setAnswerState(item, isOpen, config) {
    const button = item.querySelector("[data-accordion-button]");
    const answer = item.querySelector(".faq-answer");
    if (!button || !answer) return;

    item.setAttribute("data-open", isOpen ? "true" : "false");
    button.setAttribute("aria-expanded", String(isOpen));

    if (config.type === "Slide") {
      answer.hidden = false;
      answer.style.overflow = "hidden";
      answer.style.transition = "max-height " + config.duration + "ms";
      if (isOpen) {
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        answer.style.maxHeight = "0px";
        window.setTimeout(() => {
          answer.hidden = true;
        }, config.duration);
      }
    } else if (config.type === "Fade") {
      answer.style.transition = "opacity " + config.duration + "ms";
      answer.style.opacity = isOpen ? "1" : "0";
      answer.hidden = !isOpen;
    } else {
      answer.hidden = !isOpen;
    }
  }

  function init(container) {
    const config = getConfig(container);
    const items = Array.from(container.querySelectorAll(".faq-item"));
    items.forEach((item, index) => {
      const button = item.querySelector("[data-accordion-button]");
      const answer = item.querySelector(".faq-answer");
      if (!button || !answer) return;

      if (!answer.id) answer.id = "faq-answer-" + index;
      if (!button.id) button.id = "faq-question-" + index;
      button.setAttribute("aria-controls", answer.id);
      answer.setAttribute("role", "region");
      answer.setAttribute("aria-labelledby", button.id);

      const isOpen = item.getAttribute("data-open") === "true";
      setAnswerState(item, isOpen, config);

      button.addEventListener("click", () => {
        const currentlyOpen = item.getAttribute("data-open") === "true";
        const nextOpen = !currentlyOpen;
        if (config.mode === "single" && nextOpen) {
          items.forEach((other) => {
            if (other !== item) {
              setAnswerState(other, false, config);
            }
          });
        }
        setAnswerState(item, nextOpen, config);
      });
    });
  }

  document.querySelectorAll(".faq-container").forEach(init);
})();