import { FAQConfig } from "./types";

const fontFamilyMap: Record<string, string> = {
  Default: "system-ui, -apple-system, sans-serif",
  Serif: "Georgia, serif",
  Mono: "monospace",
  Sans: "sans-serif",
  Inter: "Inter, sans-serif",
  Roboto: "Roboto, sans-serif",
  "Open Sans": '"Open Sans", sans-serif',
  Lato: "Lato, sans-serif",
  Montserrat: "Montserrat, sans-serif",
  Poppins: "Poppins, sans-serif",
};

const fontSizeMap: Record<string, string> = {
  XS: "0.75rem",
  SM: "0.875rem",
  MD: "1rem",
  LG: "1.125rem",
  XL: "1.25rem",
  "2XL": "1.5rem",
  "3XL": "1.875rem",
  "4XL": "2.25rem",
};

const fontWeightMap: Record<string, string> = {
  Light: "300",
  Normal: "400",
  Medium: "500",
  Semibold: "600",
  Bold: "700",
};

export function renderFAQ(config: FAQConfig): { html: string; css: string } {
  const { content, styles } = config;

  const css = generateCSS(styles);
  const html = generateHTML(content, styles);

  return { html, css };
}

function generateCSS(styles: typeof import("./types").FAQStyles): string {
  const {
    heading,
    description,
    question,
    answer,
    backgroundColor,
    backgroundGradient,
    accordion,
    spacing,
  } = styles;

  const bg = backgroundGradient || backgroundColor;

  return `
    .faq-container {
      background: ${bg};
      padding: ${spacing.sectionPadding}px;
      font-family: ${fontFamilyMap[heading.fontFamily] || fontFamilyMap.Default};
    }
    .faq-heading {
      font-family: ${fontFamilyMap[heading.fontFamily] || fontFamilyMap.Default};
      font-size: ${fontSizeMap[heading.fontSize]};
      font-weight: ${fontWeightMap[heading.fontWeight]};
      color: ${heading.color};
      margin-bottom: 12px;
    }
    .faq-description {
      font-family: ${fontFamilyMap[description.fontFamily] || fontFamilyMap.Default};
      font-size: ${fontSizeMap[description.fontSize]};
      font-weight: ${fontWeightMap[description.fontWeight]};
      color: ${description.color};
      margin-bottom: ${spacing.itemSpacing}px;
    }
    .faq-item {
      margin-bottom: ${spacing.itemSpacing}px;
      border-radius: 4px;
      overflow: hidden;
      ${
        accordion.borderVisible
          ? `
        border-style: ${accordion.borderStyle};
        border-color: ${accordion.borderColor};
        border-width: ${accordion.borderWidth}px;
        ${
          !accordion.borderSides.top
            ? "border-top: none;"
            : ""
        }
        ${
          !accordion.borderSides.right
            ? "border-right: none;"
            : ""
        }
        ${
          !accordion.borderSides.bottom
            ? "border-bottom: none;"
            : ""
        }
        ${
          !accordion.borderSides.left
            ? "border-left: none;"
            : ""
        }
      `
          : "border: none;"
      }
    }
    .faq-question {
      font-family: ${fontFamilyMap[question.fontFamily] || fontFamilyMap.Default};
      font-size: ${fontSizeMap[question.fontSize]};
      font-weight: ${fontWeightMap[question.fontWeight]};
      color: ${question.color};
      padding: ${accordion.paddingY}px ${accordion.paddingX}px;
      margin: ${accordion.marginY}px ${accordion.marginX}px;
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
      font-family: ${fontFamilyMap[answer.fontFamily] || fontFamilyMap.Default};
      font-size: ${fontSizeMap[answer.fontSize]};
      font-weight: ${fontWeightMap[answer.fontWeight]};
      color: ${answer.color};
      padding: 0 ${accordion.paddingX}px ${accordion.paddingY}px;
      margin: 0 ${accordion.marginX}px ${accordion.marginY}px;
      ${accordion.animationType === "Fade" ? `transition: opacity ${accordion.animationDuration}ms;` : ""}
      ${accordion.animationType === "Slide" ? `transition: max-height ${accordion.animationDuration}ms;` : ""}
    }
    .faq-answer[hidden] {
      display: none;
    }
    .faq-icon {
      transition: transform ${accordion.animationDuration}ms;
      flex-shrink: 0;
    }
    .faq-item[data-open="true"] .faq-icon {
      transform: rotate(180deg);
    }
  `;
}

function generateHTML(
  content: typeof import("./types").FAQContent,
  styles: typeof import("./types").FAQStyles
): string {
  const { heading, description, items } = content;
  const { accordion } = styles;

  const iconSvg =
    accordion.iconStyle === "Plus"
      ? `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
           <line x1="8" y1="4" x2="8" y2="12" stroke-width="2"/>
           <line x1="4" y1="8" x2="12" y2="8" stroke-width="2"/>
         </svg>`
      : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
           <path d="M4 6 L8 10 L12 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
         </svg>`;

  const itemsHTML = items
    .map(
      (item, index) => `
    <div class="faq-item" data-open="false">
      <button class="faq-question" onclick="toggleFAQ(this)" aria-expanded="false">
        <span>${escapeHtml(item.question || `Question ${index + 1}`)}</span>
        <span class="faq-icon">${iconSvg}</span>
      </button>
      <div class="faq-answer" id="answer-${index}">
        ${escapeHtml(item.answer || `Answer ${index + 1}`)}
      </div>
    </div>
  `
    )
    .join("");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question || "",
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer || "",
      },
    })),
  };

  return `
    <div class="faq-container">
      <h2 class="faq-heading">${escapeHtml(heading)}</h2>
      ${description ? `<p class="faq-description">${escapeHtml(description)}</p>` : ""}
      <div class="faq-items">
        ${itemsHTML}
      </div>
    </div>
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    <script>
      function toggleFAQ(button) {
        const item = button.closest('.faq-item');
        const answer = item.querySelector('.faq-answer');
        const isOpen = item.getAttribute('data-open') === 'true';
        
        item.setAttribute('data-open', !isOpen);
        button.setAttribute('aria-expanded', !isOpen);
        
        if ('${accordion.animationType}' === 'Fade') {
          answer.style.opacity = isOpen ? '0' : '1';
          answer.hidden = isOpen;
        } else if ('${accordion.animationType}' === 'Slide') {
          if (isOpen) {
            answer.style.maxHeight = '0';
            answer.hidden = true;
          } else {
            answer.hidden = false;
            answer.style.maxHeight = answer.scrollHeight + 'px';
          }
        } else {
          answer.hidden = isOpen;
        }
      }
      
      // Initialize - all answers visible for SEO
      document.querySelectorAll('.faq-answer').forEach(answer => {
        answer.hidden = false;
        if ('${accordion.animationType}' === 'Fade') {
          answer.style.opacity = '1';
        } else if ('${accordion.animationType}' === 'Slide') {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    </script>
  `;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
