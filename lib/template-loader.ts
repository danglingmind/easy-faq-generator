import { FAQContent, FAQStyles } from "./types";
import { TemplateFile } from "./r2";
import { generateDynamicCSS } from "./template-styles";

/**
 * Placeholder markers in templates
 */
const PLACEHOLDERS = {
  HEADING: "{{heading}}",
  DESCRIPTION: "{{description}}",
  ITEMS: "{{items}}",
  STYLES: "{{styles}}",
  JSON_LD: "{{jsonLd}}",
};

/**
 * Inject content into template HTML
 */
export function injectContent(
  template: TemplateFile,
  content: FAQContent,
  styles: FAQStyles,
  templateId?: string
): string {
  let html = template.html;
  
  // Add template and accordion metadata to container
  const animationAttrs = `data-animation-type="${styles.accordion.animationType}" data-animation-duration="${styles.accordion.animationDuration}" data-accordion-mode="single"`;
  const templateAttr = templateId ? ` data-template="${templateId}"` : "";
  html = html.replace(
    /class=["']?faq-container["']?/g,
    `class="faq-container"${templateAttr} ${animationAttrs}`
  );

  // Inject heading (split template uses highlighted word styling)
  const headingHtml =
    templateId === "split"
      ? formatSplitHeading(content.heading)
      : escapeHtml(content.heading);
  html = html.replace(new RegExp(PLACEHOLDERS.HEADING, "g"), headingHtml);

  // Inject description (optional)
  const descriptionHtml = content.description
    ? `<p class="faq-description">${escapeHtml(content.description)}</p>`
    : "";
  html = html.replace(new RegExp(PLACEHOLDERS.DESCRIPTION, "g"), descriptionHtml);

  // Inject FAQ items
  const itemsHtml = generateItemsHTML(content.items, styles);
  html = html.replace(new RegExp(PLACEHOLDERS.ITEMS, "g"), itemsHtml);

  // Inject JSON-LD schema
  const jsonLd = generateJSONLD(content);
  html = html.replace(new RegExp(PLACEHOLDERS.JSON_LD, "g"), jsonLd);

  // Generate dynamic CSS from styles object and merge with template CSS
  // Dynamic CSS comes AFTER template CSS so user customizations override template defaults
  // Pass templateId to skip certain overrides for template-specific styles
  const dynamicCSS = generateDynamicCSS(styles, templateId);
  const combinedCSS = `/* Template Base Styles */\n${template.css}\n\n/* User Customizations */\n${dynamicCSS}`;

  // Inject CSS (replace {{styles}} placeholder or append to head)
  if (html.includes(PLACEHOLDERS.STYLES)) {
    html = html.replace(new RegExp(PLACEHOLDERS.STYLES, "g"), `<style>${combinedCSS}</style>`);
  } else {
    // If no placeholder, inject before closing </head> or at the end
    if (html.includes("</head>")) {
      html = html.replace("</head>", `<style>${combinedCSS}</style></head>`);
    } else {
      html = `<style>${combinedCSS}</style>${html}`;
    }
  }

  // Inject JS if present
  if (template.js) {
    if (html.includes("</body>")) {
      html = html.replace("</body>", `<script>${template.js}</script></body>`);
    } else {
      html = `${html}<script>${template.js}</script>`;
    }
  }

  return html;
}

/**
 * Generate FAQ items HTML based on template structure
 * This is a fallback if template doesn't have {{items}} placeholder
 */
function generateItemsHTML(
  items: FAQContent["items"],
  styles: FAQStyles
): string {
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

  return items
    .map(
      (item, index) => `
    <div class="faq-item" data-open="false">
      <button
        class="faq-question"
        data-accordion-button
        aria-expanded="false"
        aria-controls="faq-answer-${index}"
        id="faq-question-${index}"
      >
        <span>${escapeHtml(item.question || `Question ${index + 1}`)}</span>
        <span class="faq-icon">${iconSvg}</span>
      </button>
      <div
        class="faq-answer"
        id="faq-answer-${index}"
        role="region"
        aria-labelledby="faq-question-${index}"
      >
        ${escapeHtml(item.answer || `Answer ${index + 1}`)}
      </div>
    </div>
  `
    )
    .join("");
}

function formatSplitHeading(heading: string): string {
  const safe = heading.trim();
  if (!safe) return "";
  const words = safe.split(/\s+/);
  if (words.length < 2) return escapeHtml(safe);

  const first = escapeHtml(words[0]);
  const second = escapeHtml(words[1]);
  const rest = escapeHtml(words.slice(2).join(" "));

  return `
    <span class="heading-line">
      <span>${first}</span>
      <span class="highlight">${second}</span>
    </span>
    ${rest ? `<span class="heading-line">${rest}</span>` : ""}
  `;
}

/**
 * Generate JSON-LD schema
 */
function generateJSONLD(content: FAQContent): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.items.map((item) => ({
      "@type": "Question",
      name: item.question || "",
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer || "",
      },
    })),
  };

  return `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Generate toggle FAQ function for templates
 */
export function generateToggleScript(animationType: string, animationDuration: number): string {
  return `
    <script>
      function toggleFAQ(button) {
        const item = button.closest('.faq-item');
        const answer = item.querySelector('.faq-answer');
        const isOpen = item.getAttribute('data-open') === 'true';
        
        item.setAttribute('data-open', !isOpen);
        button.setAttribute('aria-expanded', !isOpen);
        
        if ('${animationType}' === 'Fade') {
          answer.style.opacity = isOpen ? '0' : '1';
          answer.hidden = isOpen;
        } else if ('${animationType}' === 'Slide') {
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
        if ('${animationType}' === 'Fade') {
          answer.style.opacity = '1';
        } else if ('${animationType}' === 'Slide') {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    </script>
  `;
}
