import { TemplateFile } from "./r2";

/**
 * Generate default template HTML/CSS as fallback
 * This is used when R2 is not configured or template doesn't exist
 */
export function generateDefaultTemplate(): TemplateFile {
  return {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FAQ</title>
  {{styles}}
</head>
<body>
  <div class="faq-container">
    <h2 class="faq-heading">{{heading}}</h2>
    {{description}}
    <div class="faq-items">
      {{items}}
    </div>
  </div>
  {{jsonLd}}
  <script>
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
  </script>
</body>
</html>`,
    css: `
    .faq-container {
      background: #ffffff;
      padding: 24px;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .faq-heading {
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 12px;
    }
    .faq-description {
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 1rem;
      font-weight: 400;
      color: #666666;
      margin-bottom: 16px;
    }
    .faq-item {
      margin-bottom: 16px;
      border-radius: 4px;
      border: 1px solid #e5e5e5;
      overflow: hidden;
    }
    .faq-question {
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1a1a1a;
      padding: 16px;
      margin: 0;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: transparent;
      border: none;
      width: 100%;
      text-align: left;
    }
    .faq-answer {
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 1rem;
      font-weight: 400;
      color: #4a4a4a;
      padding: 0 16px 16px;
      margin: 0;
    }
    .faq-answer[hidden] {
      display: none;
    }
    .faq-icon {
      transition: transform 300ms;
      flex-shrink: 0;
    }
    .faq-item[data-open="true"] .faq-icon {
      transform: rotate(180deg);
    }
  `,
  };
}
