import { FAQStyles } from "./types";
import { TemplateProtection, isPropertyProtected } from "./template-protection";

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
 * @param styles - The styles object
 * @param templateId - Optional template ID for higher specificity selectors
 * @param templateCSS - Optional template CSS (for backward compatibility)
 * @param protection - Optional protection object to control which properties are editable
 */
export function generateDynamicCSS(
  styles: FAQStyles, 
  templateId?: string, 
  templateCSS?: string,
  protection?: TemplateProtection | null
): string {
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
  
  // Use protection if provided, otherwise fall back to old detection method for backward compatibility
  const isTemplateControlled = protection 
    ? Object.values(protection).some(v => v === true) // If any property is protected, use old behavior as fallback
    : isTemplateProtected(templateCSS);
  
  // Helper to check if a property is protected
  const isProtected = (path: string) => protection ? isPropertyProtected(protection, path) : false;

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
    /* Use higher specificity selector for templates that use data-template attribute */
    /* Use higher specificity selector for templates that use data-template attribute */
    ${templateId ? `.faq-container[data-template="${templateId}"]` : '.faq-container'} {
      ${!isProtected('backgroundColor') ? `background: ${bg} !important;` : ''}
      ${!isProtected('spacing.sectionPadding') ? `padding: ${spacing.sectionPadding}px !important;` : ''}
      font-family: ${fontFamilyMap[heading.fontFamily] || fontFamilyMap.Default} !important;
    }
    ${templateId ? `.faq-container[data-template="${templateId}"] .faq-heading` : '.faq-heading'} {
      ${!isProtected('heading.fontFamily') ? `font-family: ${fontFamilyMap[heading.fontFamily] || fontFamilyMap.Default} !important;` : ''}
      ${!isProtected('heading.fontSize') ? `font-size: ${fontSizeMap[heading.fontSize]} !important;` : ''}
      ${!isProtected('heading.fontWeight') ? `font-weight: ${fontWeightMap[heading.fontWeight]} !important;` : ''}
      ${!isProtected('heading.color') ? `color: ${heading.color} !important;` : ''}
    }
    ${templateId ? `.faq-container[data-template="${templateId}"] .faq-description` : '.faq-description'} {
      ${!isProtected('description.fontFamily') ? `font-family: ${fontFamilyMap[description.fontFamily] || fontFamilyMap.Default} !important;` : ''}
      ${!isProtected('description.fontSize') ? `font-size: ${fontSizeMap[description.fontSize]} !important;` : ''}
      ${!isProtected('description.fontWeight') ? `font-weight: ${fontWeightMap[description.fontWeight]} !important;` : ''}
      ${!isProtected('description.color') ? `color: ${description.color} !important;` : ''}
    }
    /* Use higher specificity selector for templates that use data-template attribute */
    ${templateId ? `.faq-container[data-template="${templateId}"] .faq-item` : '.faq-item'} {
      ${!isProtected('spacing.itemSpacing') ? `margin-bottom: ${spacing.itemSpacing}px !important;` : ''}
      ${
        borderVisible && !isProtected('accordion.borderVisible')
          ? `
        /* Explicitly set each border side individually for proper control */
        ${
          borderSides.top && !isProtected('accordion.borderColor') && !isProtected('accordion.borderWidth') && !isProtected('accordion.borderStyle')
            ? `border-top: ${borderWidth}px ${borderStyle} ${borderColor} !important;`
            : borderSides.top ? "border-top: none !important;" : ""
        }
        ${
          borderSides.right && !isProtected('accordion.borderColor') && !isProtected('accordion.borderWidth') && !isProtected('accordion.borderStyle')
            ? `border-right: ${borderWidth}px ${borderStyle} ${borderColor} !important;`
            : borderSides.right ? "border-right: none !important;" : ""
        }
        ${
          borderSides.bottom && !isProtected('accordion.borderColor') && !isProtected('accordion.borderWidth') && !isProtected('accordion.borderStyle')
            ? `border-bottom: ${borderWidth}px ${borderStyle} ${borderColor} !important;`
            : borderSides.bottom ? "border-bottom: none !important;" : ""
        }
        ${
          borderSides.left && !isProtected('accordion.borderColor') && !isProtected('accordion.borderWidth') && !isProtected('accordion.borderStyle')
            ? `border-left: ${borderWidth}px ${borderStyle} ${borderColor} !important;`
            : borderSides.left ? "border-left: none !important;" : ""
        }
      `
          : !isProtected('accordion.borderVisible') ? `
        border-top: none !important;
        border-right: none !important;
        border-bottom: none !important;
        border-left: none !important;
      ` : ''
      }
    }
    /* Use higher specificity selector for templates that use data-template attribute */
    ${templateId ? `.faq-container[data-template="${templateId}"] .faq-question` : '.faq-question'} {
      ${!isProtected('question.fontFamily') ? `font-family: ${fontFamilyMap[question.fontFamily] || fontFamilyMap.Default} !important;` : ''}
      ${!isProtected('question.fontSize') ? `font-size: ${fontSizeMap[question.fontSize]} !important;` : ''}
      ${!isProtected('question.fontWeight') ? `font-weight: ${fontWeightMap[question.fontWeight]} !important;` : ''}
      ${!isProtected('question.color') ? `color: ${question.color} !important;` : ''}
      ${!isProtected('accordion.paddingX') && !isProtected('accordion.paddingY') ? `padding: ${accordion.paddingY}px ${accordion.paddingX}px !important;` : 
        !isProtected('accordion.paddingX') && isProtected('accordion.paddingY') ? `padding-left: ${accordion.paddingX}px !important; padding-right: ${accordion.paddingX}px !important;` :
        isProtected('accordion.paddingX') && !isProtected('accordion.paddingY') ? `padding-top: ${accordion.paddingY}px !important; padding-bottom: ${accordion.paddingY}px !important;` : ''}
      ${!isProtected('accordion.marginX') && !isProtected('accordion.marginY') ? `margin: ${accordion.marginY}px ${accordion.marginX}px !important;` : 
        !isProtected('accordion.marginX') && isProtected('accordion.marginY') ? `margin-left: ${accordion.marginX}px !important; margin-right: ${accordion.marginX}px !important;` :
        isProtected('accordion.marginX') && !isProtected('accordion.marginY') ? `margin-top: ${accordion.marginY}px !important; margin-bottom: ${accordion.marginY}px !important;` : ''}
    }
    ${templateId ? `.faq-container[data-template="${templateId}"] .faq-answer` : '.faq-answer'} {
      ${!isProtected('answer.fontFamily') ? `font-family: ${fontFamilyMap[answer.fontFamily] || fontFamilyMap.Default} !important;` : ''}
      ${!isProtected('answer.fontSize') ? `font-size: ${fontSizeMap[answer.fontSize]} !important;` : ''}
      ${!isProtected('answer.fontWeight') ? `font-weight: ${fontWeightMap[answer.fontWeight]} !important;` : ''}
      ${!isProtected('answer.color') ? `color: ${answer.color} !important;` : ''}
      ${!isProtected('accordion.paddingX') && !isProtected('accordion.paddingY') ? `padding: 0 ${accordion.paddingX}px ${accordion.paddingY}px !important;` : 
        !isProtected('accordion.paddingX') && isProtected('accordion.paddingY') ? `padding-left: ${accordion.paddingX}px !important; padding-right: ${accordion.paddingX}px !important;` :
        isProtected('accordion.paddingX') && !isProtected('accordion.paddingY') ? `padding-bottom: ${accordion.paddingY}px !important;` : ''}
      ${!isProtected('accordion.marginX') && !isProtected('accordion.marginY') ? `margin: 0 ${accordion.marginX}px ${accordion.marginY}px !important;` : 
        !isProtected('accordion.marginX') && isProtected('accordion.marginY') ? `margin-left: ${accordion.marginX}px !important; margin-right: ${accordion.marginX}px !important;` :
        isProtected('accordion.marginX') && !isProtected('accordion.marginY') ? `margin-bottom: ${accordion.marginY}px !important;` : ''}
      ${accordion.animationType === "Fade" ? `transition: opacity ${accordion.animationDuration}ms !important;` : ""}
      ${accordion.animationType === "Slide" ? `transition: max-height ${accordion.animationDuration}ms !important;` : ""}
    }
    .faq-icon {
      transition: transform ${accordion.animationDuration}ms !important;
    }
  `;
}
