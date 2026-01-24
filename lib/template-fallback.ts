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
    function toggleFAQ(button) {
      const item = button.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.getAttribute('data-open') === 'true';
      
      item.setAttribute('data-open', !isOpen);
      button.setAttribute('aria-expanded', !isOpen);
      answer.hidden = isOpen;
    }
    
    // Initialize - all answers visible for SEO
    document.querySelectorAll('.faq-answer').forEach(answer => {
      answer.hidden = false;
    });
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
