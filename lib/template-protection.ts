/**
 * Template Protection System
 * 
 * Allows templates to mark specific properties as protected (non-editable)
 * using CSS comments with @protect directive.
 * 
 * Syntax:
 *   @protect: property1, property2
 *   .selector { ... }
 * 
 * Example:
 *   CSS comment: @protect: background-color, color
 *   Before selector: .faq-container { ... }
 */

export interface TemplateProtection {
  // Container properties
  backgroundColor?: boolean;
  sectionPadding?: boolean;
  
  // Heading properties
  headingFontFamily?: boolean;
  headingFontSize?: boolean;
  headingFontWeight?: boolean;
  headingColor?: boolean;
  
  // Description properties
  descriptionFontFamily?: boolean;
  descriptionFontSize?: boolean;
  descriptionFontWeight?: boolean;
  descriptionColor?: boolean;
  
  // Question properties
  questionFontFamily?: boolean;
  questionFontSize?: boolean;
  questionFontWeight?: boolean;
  questionColor?: boolean;
  questionPaddingX?: boolean;
  questionPaddingY?: boolean;
  questionMarginX?: boolean;
  questionMarginY?: boolean;
  
  // Answer properties
  answerFontFamily?: boolean;
  answerFontSize?: boolean;
  answerFontWeight?: boolean;
  answerColor?: boolean;
  answerPaddingX?: boolean;
  answerPaddingY?: boolean;
  answerMarginX?: boolean;
  answerMarginY?: boolean;
  
  // Accordion/Item properties
  itemSpacing?: boolean;
  borderColor?: boolean;
  borderWidth?: boolean;
  borderStyle?: boolean;
  borderVisible?: boolean;
}


/**
 * Parse @protect comments from CSS and extract protection flags
 * 
 * Syntax: CSS comment with @protect directive before selector
 * Example: @protect: property1, property2
 *          .selector { ... }
 * 
 * @param css - The template CSS string
 * @returns TemplateProtection object with protected properties set to true
 */
export function parseTemplateProtection(css: string): TemplateProtection {
  const protection: TemplateProtection = {};
  
  // Match @protect comments followed by a selector
  // Pattern: /* @protect: props */ .selector { ... }
  const protectRegex = /\/\*\s*@protect:\s*([^*]+?)\s*\*\/\s*([.#][\w-]+(?:\s*[.#][\w-]+)*)\s*\{/gi;
  
  let match;
  while ((match = protectRegex.exec(css)) !== null) {
    const properties = match[1].split(',').map(p => p.trim().toLowerCase());
    const selector = match[2].trim();
    
    // Determine element type from selector
    let elementType: string | null = null;
    
    if (selector.includes('faq-container') || selector === '.faq-container') {
      elementType = 'container';
    } else if (selector.includes('faq-heading') || selector.includes('heading')) {
      elementType = 'heading';
    } else if (selector.includes('faq-description') || selector.includes('description')) {
      elementType = 'description';
    } else if (selector.includes('faq-question') || selector.includes('question')) {
      elementType = 'question';
    } else if (selector.includes('faq-answer') || selector.includes('answer')) {
      elementType = 'answer';
    } else if (selector.includes('faq-item') || selector.includes('item')) {
      elementType = 'item';
    }
    
    if (!elementType) continue;
    
    // Map properties to protection flags
    for (const prop of properties) {
      const normalizedProp = prop.trim().toLowerCase();
      
      if (elementType === 'container') {
        if (normalizedProp === 'background-color' || normalizedProp === 'background') {
          protection.backgroundColor = true;
        } else if (normalizedProp === 'padding') {
          protection.sectionPadding = true;
        }
      } else if (elementType === 'heading') {
        if (normalizedProp === 'font-family') {
          protection.headingFontFamily = true;
        } else if (normalizedProp === 'font-size') {
          protection.headingFontSize = true;
        } else if (normalizedProp === 'font-weight') {
          protection.headingFontWeight = true;
        } else if (normalizedProp === 'color') {
          protection.headingColor = true;
        }
      } else if (elementType === 'description') {
        if (normalizedProp === 'font-family') {
          protection.descriptionFontFamily = true;
        } else if (normalizedProp === 'font-size') {
          protection.descriptionFontSize = true;
        } else if (normalizedProp === 'font-weight') {
          protection.descriptionFontWeight = true;
        } else if (normalizedProp === 'color') {
          protection.descriptionColor = true;
        }
      } else if (elementType === 'question') {
        if (normalizedProp === 'font-family') {
          protection.questionFontFamily = true;
        } else if (normalizedProp === 'font-size') {
          protection.questionFontSize = true;
        } else if (normalizedProp === 'font-weight') {
          protection.questionFontWeight = true;
        } else if (normalizedProp === 'color') {
          protection.questionColor = true;
        } else if (normalizedProp === 'padding' || normalizedProp === 'padding-x') {
          protection.questionPaddingX = true;
        } else if (normalizedProp === 'padding-y') {
          protection.questionPaddingY = true;
        } else if (normalizedProp === 'margin' || normalizedProp === 'margin-x') {
          protection.questionMarginX = true;
        } else if (normalizedProp === 'margin-y') {
          protection.questionMarginY = true;
        }
      } else if (elementType === 'answer') {
        if (normalizedProp === 'font-family') {
          protection.answerFontFamily = true;
        } else if (normalizedProp === 'font-size') {
          protection.answerFontSize = true;
        } else if (normalizedProp === 'font-weight') {
          protection.answerFontWeight = true;
        } else if (normalizedProp === 'color') {
          protection.answerColor = true;
        } else if (normalizedProp === 'padding' || normalizedProp === 'padding-x') {
          protection.answerPaddingX = true;
        } else if (normalizedProp === 'padding-y') {
          protection.answerPaddingY = true;
        } else if (normalizedProp === 'margin' || normalizedProp === 'margin-x') {
          protection.answerMarginX = true;
        } else if (normalizedProp === 'margin-y') {
          protection.answerMarginY = true;
        }
      } else if (elementType === 'item') {
        if (normalizedProp === 'margin-bottom' || normalizedProp === 'spacing') {
          protection.itemSpacing = true;
        } else if (normalizedProp === 'border-color') {
          protection.borderColor = true;
        } else if (normalizedProp === 'border-width') {
          protection.borderWidth = true;
        } else if (normalizedProp === 'border-style') {
          protection.borderStyle = true;
        } else if (normalizedProp === 'border') {
          protection.borderVisible = true;
        }
      }
    }
  }
  
  return protection;
}

/**
 * Check if a specific style property is protected
 * 
 * @param protection - The protection object
 * @param path - Property path like "heading.color", "accordion.paddingX", "spacing.sectionPadding"
 */
export function isPropertyProtected(
  protection: TemplateProtection | null | undefined,
  path: string
): boolean {
  if (!protection) return false;
  
  // Map property paths to protection keys
  const pathMap: Record<string, keyof TemplateProtection> = {
    'backgroundColor': 'backgroundColor',
    'spacing.sectionPadding': 'sectionPadding',
    'spacing.itemSpacing': 'itemSpacing',
    'heading.fontFamily': 'headingFontFamily',
    'heading.fontSize': 'headingFontSize',
    'heading.fontWeight': 'headingFontWeight',
    'heading.color': 'headingColor',
    'description.fontFamily': 'descriptionFontFamily',
    'description.fontSize': 'descriptionFontSize',
    'description.fontWeight': 'descriptionFontWeight',
    'description.color': 'descriptionColor',
    'question.fontFamily': 'questionFontFamily',
    'question.fontSize': 'questionFontSize',
    'question.fontWeight': 'questionFontWeight',
    'question.color': 'questionColor',
    'accordion.paddingX': 'questionPaddingX',
    'accordion.paddingY': 'questionPaddingY',
    'accordion.marginX': 'questionMarginX',
    'accordion.marginY': 'questionMarginY',
    'answer.fontFamily': 'answerFontFamily',
    'answer.fontSize': 'answerFontSize',
    'answer.fontWeight': 'answerFontWeight',
    'answer.color': 'answerColor',
    'accordion.borderColor': 'borderColor',
    'accordion.borderWidth': 'borderWidth',
    'accordion.borderStyle': 'borderStyle',
    'accordion.borderVisible': 'borderVisible',
  };
  
  const protectionKey = pathMap[path];
  if (!protectionKey) return false;
  
  return protection[protectionKey] === true;
}
