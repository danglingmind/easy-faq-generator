import { FAQStyles } from "./types";

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

const googleFontFamilyMap: Record<string, string> = {
  Inter: "Inter:wght@300;400;500;600;700",
  Roboto: "Roboto:wght@300;400;500;700",
  "Open Sans": "Open+Sans:wght@300;400;600;700",
  Lato: "Lato:wght@300;400;700",
  Montserrat: "Montserrat:wght@300;400;500;600;700",
  Poppins: "Poppins:wght@300;400;500;600;700",
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

/**
 * Detect if a template should be protected from user customizations
 * A template is considered "protected" if it uses !important in its CSS,
 * indicating it has strong styling preferences that shouldn't be overridden
 * 
 * See TEMPLATE_FORMAT.md for template format specification
 */
function isTemplateProtected(templateCSS?: string): boolean {
  if (!templateCSS) return false;
  // Check if template CSS uses !important (indicating it wants to control styling)
  // We look for a reasonable threshold - if more than 3 properties use !important,
  // the template likely wants full control
  // This follows the standard defined in TEMPLATE_FORMAT.md
  const importantMatches = templateCSS.match(/!important/gi);
  return importantMatches ? importantMatches.length > 3 : false;
}

/**
 * Generate dynamic CSS from styles object
 * This applies user customizations to the template
 * 
 * Templates using !important (see TEMPLATE_FORMAT.md) are automatically protected
 * from user customizations to preserve their visual identity.
 * 
 * @param styles - The styles object
 * @param templateId - Optional template ID for higher specificity selectors
 * @param templateCSS - Optional template CSS to detect if template should be protected
 */
export function generateDynamicCSS(styles: FAQStyles, templateId?: string, templateCSS?: string): string {
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
  const fontsToLoad = new Set<string>();
  [heading.fontFamily, description.fontFamily, question.fontFamily, answer.fontFamily].forEach(
    (font) => {
      if (font && googleFontFamilyMap[font]) {
        fontsToLoad.add(googleFontFamilyMap[font]);
      }
    }
  );
  const googleFontsImport =
    fontsToLoad.size > 0
      ? `@import url("https://fonts.googleapis.com/css2?${Array.from(fontsToLoad)
          .map((family) => `family=${family}`)
          .join("&")}&display=swap");\n`
      : "";
  
  // Automatically detect if template should be protected based on its CSS
  const isTemplateControlled = isTemplateProtected(templateCSS);

  // Defensive check for borderSides - ensure it exists and has all properties
  const borderSides = accordion.borderSides || {
    top: true,
    right: true,
    bottom: true,
    left: true,
  };

  // Get border properties with proper defaults
  const borderVisible = accordion.borderVisible !== undefined ? accordion.borderVisible : true;
  const borderWidth = accordion.borderWidth ?? 1;
  const borderStyle = accordion.borderStyle || "solid";
  const borderColor = accordion.borderColor || "#e5e5e5";

  return `
    ${googleFontsImport}
    .faq-container {
      ${!isTemplateControlled ? `background: ${bg} !important;` : ''}
      padding: ${spacing.sectionPadding}px !important;
      font-family: ${fontFamilyMap[heading.fontFamily] || fontFamilyMap.Default} !important;
    }
    .faq-heading {
      ${!isTemplateControlled ? `font-family: ${fontFamilyMap[heading.fontFamily] || fontFamilyMap.Default} !important;` : ''}
      ${!isTemplateControlled ? `font-size: ${fontSizeMap[heading.fontSize]} !important;` : ''}
      ${!isTemplateControlled ? `font-weight: ${fontWeightMap[heading.fontWeight]} !important;` : ''}
      ${!isTemplateControlled ? `color: ${heading.color} !important;` : ''}
    }
    .faq-description {
      ${!isTemplateControlled ? `font-family: ${fontFamilyMap[description.fontFamily] || fontFamilyMap.Default} !important;` : ''}
      ${!isTemplateControlled ? `font-size: ${fontSizeMap[description.fontSize]} !important;` : ''}
      ${!isTemplateControlled ? `font-weight: ${fontWeightMap[description.fontWeight]} !important;` : ''}
      ${!isTemplateControlled ? `color: ${description.color} !important;` : ''}
    }
    /* Use higher specificity selector for templates that use data-template attribute */
    ${templateId ? `.faq-container[data-template="${templateId}"] .faq-item` : '.faq-item'} {
      margin-bottom: ${spacing.itemSpacing}px !important;
      ${
        borderVisible
          ? `
        /* Explicitly set each border side individually for proper control */
        ${
          borderSides.top
            ? `border-top: ${borderWidth}px ${borderStyle} ${borderColor} !important;`
            : "border-top: none !important;"
        }
        ${
          borderSides.right
            ? `border-right: ${borderWidth}px ${borderStyle} ${borderColor} !important;`
            : "border-right: none !important;"
        }
        ${
          borderSides.bottom
            ? `border-bottom: ${borderWidth}px ${borderStyle} ${borderColor} !important;`
            : "border-bottom: none !important;"
        }
        ${
          borderSides.left
            ? `border-left: ${borderWidth}px ${borderStyle} ${borderColor} !important;`
            : "border-left: none !important;"
        }
      `
          : `
        border-top: none !important;
        border-right: none !important;
        border-bottom: none !important;
        border-left: none !important;
      `
      }
    }
    /* Use higher specificity selector for templates that use data-template attribute */
    ${templateId ? `.faq-container[data-template="${templateId}"] .faq-question` : '.faq-question'} {
      ${!isTemplateControlled ? `font-family: ${fontFamilyMap[question.fontFamily] || fontFamilyMap.Default} !important;` : ''}
      ${!isTemplateControlled ? `font-size: ${fontSizeMap[question.fontSize]} !important;` : ''}
      ${!isTemplateControlled ? `font-weight: ${fontWeightMap[question.fontWeight]} !important;` : ''}
      ${!isTemplateControlled ? `color: ${question.color} !important;` : ''}
      ${!isTemplateControlled ? `padding: ${accordion.paddingY}px ${accordion.paddingX}px !important;` : ''}
      ${!isTemplateControlled ? `margin: ${accordion.marginY}px ${accordion.marginX}px !important;` : ''}
    }
    ${templateId ? `.faq-container[data-template="${templateId}"] .faq-answer` : '.faq-answer'} {
      ${!isTemplateControlled ? `font-family: ${fontFamilyMap[answer.fontFamily] || fontFamilyMap.Default} !important;` : ''}
      ${!isTemplateControlled ? `font-size: ${fontSizeMap[answer.fontSize]} !important;` : ''}
      ${!isTemplateControlled ? `font-weight: ${fontWeightMap[answer.fontWeight]} !important;` : ''}
      ${!isTemplateControlled ? `color: ${answer.color} !important;` : ''}
      ${!isTemplateControlled ? `padding: 0 ${accordion.paddingX}px ${accordion.paddingY}px !important;` : ''}
      ${!isTemplateControlled ? `margin: 0 ${accordion.marginX}px ${accordion.marginY}px !important;` : ''}
      ${accordion.animationType === "Fade" ? `transition: opacity ${accordion.animationDuration}ms !important;` : ""}
      ${accordion.animationType === "Slide" ? `transition: max-height ${accordion.animationDuration}ms !important;` : ""}
    }
    .faq-icon {
      transition: transform ${accordion.animationDuration}ms !important;
    }
  `;
}
