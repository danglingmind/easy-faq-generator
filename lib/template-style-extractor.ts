import { FAQStyles } from "./types";
import { defaultStyles } from "./templates";
import { parseTemplateProtection, TemplateProtection } from "./template-protection";

/**
 * Extract CSS property value from CSS string
 * Handles multiline CSS and various formats
 */
function extractCSSValue(css: string, selector: string, property: string): string | null {
  // The selector comes with escaped regex characters (like \\. for .)
  // We need to use it as-is in the regex, but handle quotes in attribute selectors
  // Match selector followed by {, then find property: value
  // Use [\s\S] instead of . to match newlines
  // Use non-greedy matching with ? to stop at first closing brace
  const regex = new RegExp(
    `${selector}\\s*\\{([\\s\\S]*?)\\}`,
    "gi"
  );
  
  // Reset regex lastIndex to ensure we start from the beginning
  regex.lastIndex = 0;
  
  // Find all matches
  let match;
  while ((match = regex.exec(css)) !== null) {
    const blockContent = match[1];
    // Look for property in this block
    const propertyRegex = new RegExp(
      `${property}\\s*:\\s*([^;!\\n]+)`,
      "i"
    );
    const propMatch = blockContent.match(propertyRegex);
    if (propMatch && propMatch[1]) {
      return propMatch[1].trim().replace(/!important/gi, "").trim();
    }
  }
  
  return null;
}

/**
 * Extract color from CSS (handles hex, rgb, rgba, named colors)
 */
function extractColor(css: string, selector: string): string | null {
  const value = extractCSSValue(css, selector, "color");
  if (value) {
    // Remove quotes if present
    return value.replace(/['"]/g, "");
  }
  return null;
}

/**
 * Extract background color from CSS
 * Handles both "background:" and "background-color:" properties
 */
function extractBackgroundColor(css: string, selector: string): string | null {
  // Try background-color first (more specific)
  let value = extractCSSValue(css, selector, "background-color");
  
  // If not found, try background property
  if (!value) {
    value = extractCSSValue(css, selector, "background");
  }
  
  if (value) {
    // Remove quotes if present
    const cleaned = value.replace(/['"]/g, "").trim();
    // Skip if it's a gradient, image, or other non-color value
    if (cleaned && !cleaned.includes("gradient") && !cleaned.includes("url") && !cleaned.includes("transparent")) {
      // If it's just "transparent", return null
      if (cleaned === "transparent") {
        return null;
      }
      return cleaned;
    }
  }
  return null;
}

/**
 * Extract font size and convert to FAQStyles fontSize enum
 */
function extractFontSize(css: string, selector: string): FAQStyles["heading"]["fontSize"] {
  const value = extractCSSValue(css, selector, "font-size");
  if (!value) return defaultStyles.heading.fontSize;

  const sizeMap: Record<string, FAQStyles["heading"]["fontSize"]> = {
    "0.75rem": "XS",
    "0.875rem": "SM",
    "0.9rem": "SM",   // Split answer uses 0.9rem
    "0.95rem": "SM",   // Split description uses 0.95rem
    "1rem": "MD",
    "1.125rem": "LG",
    "1.25rem": "XL",
    "1.5rem": "2XL",
    "1.875rem": "3XL",
    "2.25rem": "4XL",
    "2.75rem": "4XL",  // Split heading uses 2.75rem
    "3.5rem": "4XL",   // Split template uses 3.5rem
  };

  // Try exact match first
  if (sizeMap[value]) {
    return sizeMap[value];
  }

  // Try to parse rem values
  const remMatch = value.match(/([\d.]+)rem/);
  if (remMatch) {
    const remValue = parseFloat(remMatch[1]);
    // Find closest match - expanded map for better matching
    const remMap: Record<number, FAQStyles["heading"]["fontSize"]> = {
      0.75: "XS",
      0.875: "SM",
      0.9: "SM",   // Split answer uses 0.9rem
      0.95: "SM",   // Split description uses 0.95rem
      1: "MD",
      1.125: "LG",
      1.25: "XL",
      1.5: "2XL",
      1.875: "3XL",
      2.25: "4XL",
      2.75: "4XL", // Split heading uses 2.75rem
      3.5: "4XL",   // Split template uses 3.5rem
    };
    
    // First try exact match
    if (remMap[remValue]) {
      return remMap[remValue];
    }
    
    // Then find closest match
    const closest = Object.keys(remMap)
      .map(Number)
      .reduce((prev, curr) => (Math.abs(curr - remValue) < Math.abs(prev - remValue) ? curr : prev));
    return remMap[closest] || defaultStyles.heading.fontSize;
  }

  return defaultStyles.heading.fontSize;
}

/**
 * Extract font family and convert to FAQStyles fontFamily enum
 */
function extractFontFamilyValue(css: string, selector: string): FAQStyles["heading"]["fontFamily"] | null {
  const value = extractCSSValue(css, selector, "font-family");
  if (!value) return null;

  const normalized = value.toLowerCase();
  if (normalized.includes("inter")) return "Inter";
  if (normalized.includes("roboto")) return "Roboto";
  if (normalized.includes("open sans")) return "Open Sans";
  if (normalized.includes("lato")) return "Lato";
  if (normalized.includes("montserrat")) return "Montserrat";
  if (normalized.includes("poppins")) return "Poppins";
  if (normalized.includes("serif") || normalized.includes("georgia")) return "Serif";
  if (normalized.includes("mono")) return "Mono";
  if (normalized.includes("sans")) return "Sans";

  return null;
}

/**
 * Extract font weight and convert to FAQStyles fontWeight enum
 */
function extractFontWeight(css: string, selector: string): FAQStyles["heading"]["fontWeight"] {
  const value = extractCSSValue(css, selector, "font-weight");
  if (!value) return defaultStyles.heading.fontWeight;

  const weightMap: Record<string, FAQStyles["heading"]["fontWeight"]> = {
    "300": "Light",
    "400": "Normal",
    "500": "Medium",
    "600": "Semibold",
    "700": "Bold",
    light: "Light",
    normal: "Normal",
    medium: "Medium",
    semibold: "Semibold",
    bold: "Bold",
  };

  return weightMap[value.toLowerCase()] || defaultStyles.heading.fontWeight;
}

/**
 * Extract padding values
 */
function extractPadding(css: string, selector: string): { x: number; y: number } | null {
  const paddingValue = extractCSSValue(css, selector, "padding");
  if (!paddingValue) return null;

  // Handle different padding formats: "24px", "24px 32px", etc.
  const parts = paddingValue.split(/\s+/);
  if (parts.length === 1) {
    const px = parseInt(parts[0]);
    return { x: px, y: px };
  } else if (parts.length >= 2) {
    const y = parseInt(parts[0]) || 0;
    const x = parseInt(parts[1]) || 0;
    return { x, y };
  }
  return null;
}

/**
 * Extract spacing values
 */
function extractSpacing(css: string): { sectionPadding: number; itemSpacing: number } {
  const sectionPadding = extractCSSValue(css, "\\.faq-container", "padding");
  const itemSpacing = extractCSSValue(css, "\\.faq-item", "margin-bottom");

  return {
    sectionPadding: sectionPadding ? parseInt(sectionPadding) || defaultStyles.spacing.sectionPadding : defaultStyles.spacing.sectionPadding,
    itemSpacing: itemSpacing ? parseInt(itemSpacing) || defaultStyles.spacing.itemSpacing : defaultStyles.spacing.itemSpacing,
  };
}

/**
 * Extract styles from template CSS and convert to FAQStyles
 * This is used to populate the editor with template values
 */
export async function extractTemplateStyles(templateId: string): Promise<FAQStyles | null> {
  try {
    // Fetch template from API
    const response = await fetch(`/api/templates/${templateId}`);
    if (!response.ok) {
      return null;
    }

    const template = await response.json();
    const css = template.css || "";

    if (!css) {
      return null;
    }

    // Extract values from CSS
    // STANDARD: All templates should use generic selectors (e.g., .faq-container, .faq-heading)
    // See TEMPLATE_FORMAT.md for the template format specification
    // 
    // We try generic selectors first (the standard), then fallback to template-specific selectors
    // for backward compatibility with older templates
    const escapedTemplateId = templateId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Template-specific selectors (fallback only - new templates should not use these)
    const templateSelector = `\\.faq-container\\[data-template=[\\"']${escapedTemplateId}[\\"']\\]`;
    const templateHeadingSelector = `${templateSelector}\\s+\\.faq-heading`;
    const templateDescriptionSelector = `${templateSelector}\\s+\\.faq-description`;
    const templateQuestionSelector = `${templateSelector}\\s+\\.faq-question`;
    const templateAnswerSelector = `${templateSelector}\\s+\\.faq-answer`;
    const templateItemSelector = `${templateSelector}\\s+\\.faq-item`;
    
    // Always try generic selectors first (standard format), then fallback to template-specific (legacy)
    // Extract background color
    let backgroundColor = extractBackgroundColor(css, "\\.faq-container") 
      || extractBackgroundColor(css, templateSelector)
      || defaultStyles.backgroundColor;
    
    // Extract colors - try generic first, then template-specific
    const headingColor = extractColor(css, "\\.faq-heading") 
      || extractColor(css, templateHeadingSelector) 
      || defaultStyles.heading.color;
    const descriptionColor = extractColor(css, "\\.faq-description")
      || extractColor(css, templateDescriptionSelector)
      || defaultStyles.description.color;
    const questionColor = extractColor(css, "\\.faq-question")
      || extractColor(css, templateQuestionSelector)
      || defaultStyles.question.color;
    const answerColor = extractColor(css, "\\.faq-answer")
      || extractColor(css, templateAnswerSelector)
      || defaultStyles.answer.color;

    // Extract font sizes - try generic first, then template-specific
    const headingFontSize = extractFontSize(css, "\\.faq-heading") 
      || extractFontSize(css, templateHeadingSelector)
      || defaultStyles.heading.fontSize;
    const descriptionFontSize = extractFontSize(css, "\\.faq-description")
      || extractFontSize(css, templateDescriptionSelector)
      || defaultStyles.description.fontSize;
    const questionFontSize = extractFontSize(css, "\\.faq-question")
      || extractFontSize(css, templateQuestionSelector)
      || defaultStyles.question.fontSize;
    const answerFontSize = extractFontSize(css, "\\.faq-answer")
      || extractFontSize(css, templateAnswerSelector)
      || defaultStyles.answer.fontSize;

    // Extract font weights - try generic first, then template-specific
    const headingFontWeight = extractFontWeight(css, "\\.faq-heading")
      || extractFontWeight(css, templateHeadingSelector)
      || defaultStyles.heading.fontWeight;
    const descriptionFontWeight = extractFontWeight(css, "\\.faq-description")
      || extractFontWeight(css, templateDescriptionSelector)
      || defaultStyles.description.fontWeight;
    const questionFontWeight = extractFontWeight(css, "\\.faq-question")
      || extractFontWeight(css, templateQuestionSelector)
      || defaultStyles.question.fontWeight;
    const answerFontWeight = extractFontWeight(css, "\\.faq-answer")
      || extractFontWeight(css, templateAnswerSelector)
      || defaultStyles.answer.fontWeight;

    // Extract container font family for fallback
    const containerFontFamily = extractFontFamilyValue(css, "\\.faq-container")
      || extractFontFamilyValue(css, templateSelector)
      || null;
    
    // Extract font families - try generic first, then template-specific, then container, then default
    const headingFontFamily = extractFontFamilyValue(css, "\\.faq-heading")
      || extractFontFamilyValue(css, templateHeadingSelector)
      || containerFontFamily
      || defaultStyles.heading.fontFamily;
    const descriptionFontFamily = extractFontFamilyValue(css, "\\.faq-description")
      || extractFontFamilyValue(css, templateDescriptionSelector)
      || containerFontFamily
      || defaultStyles.description.fontFamily;
    const questionFontFamily = extractFontFamilyValue(css, "\\.faq-question")
      || extractFontFamilyValue(css, templateQuestionSelector)
      || containerFontFamily
      || defaultStyles.question.fontFamily;
    const answerFontFamily = extractFontFamilyValue(css, "\\.faq-answer")
      || extractFontFamilyValue(css, templateAnswerSelector)
      || containerFontFamily
      || defaultStyles.answer.fontFamily;

    // Extract spacing and padding - try generic first, then template-specific
    const spacing = extractSpacing(css);
    const questionPadding = extractPadding(css, "\\.faq-question")
      || extractPadding(css, templateQuestionSelector);

    // Extract border properties - try generic first, then template-specific
    const borderTop = extractCSSValue(css, "\\.faq-item", "border-top")
      || extractCSSValue(css, templateItemSelector, "border-top");
    const borderRight = extractCSSValue(css, "\\.faq-item", "border-right")
      || extractCSSValue(css, templateItemSelector, "border-right");
    const borderBottom = extractCSSValue(css, "\\.faq-item", "border-bottom")
      || extractCSSValue(css, templateItemSelector, "border-bottom");
    const borderLeft = extractCSSValue(css, "\\.faq-item", "border-left")
      || extractCSSValue(css, templateItemSelector, "border-left");
    const border = extractCSSValue(css, "\\.faq-item", "border")
      || extractCSSValue(css, templateItemSelector, "border");
    
    // Determine if border is visible and extract border properties
    const hasBorder = !!(borderTop || borderRight || borderBottom || borderLeft || (border && border !== "none"));
    
    // Extract border color, width, and style from border property or individual sides
    let borderColor = defaultStyles.accordion.borderColor;
    let borderWidth = defaultStyles.accordion.borderWidth;
    let borderStyle: "solid" | "dashed" | "dotted" | "double" | "groove" | "ridge" | "inset" | "outset" = defaultStyles.accordion.borderStyle;
    
    if (borderTop || border) {
      const borderValue = borderTop || border;
      if (borderValue) {
        // Parse border value: "1px solid #e5e5e5" or similar
        const borderMatch = borderValue.match(/(\d+)px\s+(\w+)\s+(.+)/);
        if (borderMatch) {
          borderWidth = parseInt(borderMatch[1]) || borderWidth;
          borderStyle = (borderMatch[2] as any) || borderStyle;
          borderColor = borderMatch[3].trim().replace(/['"]/g, "") || borderColor;
        }
      }
    }
    
    // Determine which sides have borders
    const borderSides = {
      top: !!(borderTop && borderTop !== "none"),
      right: !!(borderRight && borderRight !== "none"),
      bottom: !!(borderBottom && borderBottom !== "none"),
      left: !!(borderLeft && borderLeft !== "none"),
    };
    
    // If no individual sides but has border property, assume all sides
    if (!borderSides.top && !borderSides.right && !borderSides.bottom && !borderSides.left && hasBorder) {
      borderSides.top = true;
      borderSides.right = true;
      borderSides.bottom = true;
      borderSides.left = true;
    }

    // Build FAQStyles object
    const templateStyles: FAQStyles = {
      ...defaultStyles,
      backgroundColor,
      heading: {
        ...defaultStyles.heading,
        color: headingColor,
        fontFamily: headingFontFamily,
        fontSize: headingFontSize,
        fontWeight: headingFontWeight,
      },
      description: {
        ...defaultStyles.description,
        color: descriptionColor,
        fontFamily: descriptionFontFamily,
        fontSize: descriptionFontSize,
        fontWeight: descriptionFontWeight,
      },
      question: {
        ...defaultStyles.question,
        color: questionColor,
        fontFamily: questionFontFamily,
        fontSize: questionFontSize,
        fontWeight: questionFontWeight,
      },
      answer: {
        ...defaultStyles.answer,
        color: answerColor,
        fontFamily: answerFontFamily,
        fontSize: answerFontSize,
        fontWeight: answerFontWeight,
      },
      spacing,
      accordion: {
        ...defaultStyles.accordion,
        paddingX: questionPadding?.x || defaultStyles.accordion.paddingX,
        paddingY: questionPadding?.y || defaultStyles.accordion.paddingY,
        borderVisible: hasBorder,
        borderColor,
        borderWidth,
        borderStyle,
        borderSides,
      },
    };

    return templateStyles;
  } catch (error) {
    console.error("Error extracting template styles:", error);
    return null;
  }
}

/**
 * Extract both styles and protection info from template CSS
 */
export async function extractTemplateStylesAndProtection(
  templateId: string
): Promise<{ styles: FAQStyles; protection: TemplateProtection } | null> {
  try {
    // Fetch template from API
    const response = await fetch(`/api/templates/${templateId}`);
    if (!response.ok) {
      return null;
    }

    const template = await response.json();
    const css = template.css || "";

    if (!css) {
      return null;
    }

    // Extract styles
    const styles = await extractTemplateStyles(templateId);
    if (!styles) {
      return null;
    }

    // Extract protection
    const protection = parseTemplateProtection(css);

    return { styles, protection };
  } catch (error) {
    console.error("Error extracting template styles and protection:", error);
    return null;
  }
}
