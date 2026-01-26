# Template Protection System Guide

## Overview

The template protection system allows template authors to mark specific properties as non-editable by users. This is controlled via CSS comments in the template CSS file.

## Syntax

Add a `/* @protect: property1, property2 */` comment directly before a CSS selector:

```css
/* @protect: background-color, padding */
.faq-container {
  background: #fff !important;
  padding: 24px !important;
}

/* @protect: font-family, font-size, color */
.faq-heading {
  font-family: "Inter", sans-serif !important;
  font-size: 2rem !important;
  color: #000 !important;
}
```

## Supported Properties

### Container (`.faq-container`)
- `background` or `background-color` → `backgroundColor`
- `padding` → `sectionPadding`

### Heading (`.faq-heading`)
- `font-family` → `headingFontFamily`
- `font-size` → `headingFontSize`
- `font-weight` → `headingFontWeight`
- `color` → `headingColor`

### Description (`.faq-description`)
- `font-family` → `descriptionFontFamily`
- `font-size` → `descriptionFontSize`
- `font-weight` → `descriptionFontWeight`
- `color` → `descriptionColor`

### Question (`.faq-question`)
- `font-family` → `questionFontFamily`
- `font-size` → `questionFontSize`
- `font-weight` → `questionFontWeight`
- `color` → `questionColor`
- `padding` or `padding-x` → `questionPaddingX`
- `padding-y` → `questionPaddingY`
- `margin` or `margin-x` → `questionMarginX`
- `margin-y` → `questionMarginY`

### Answer (`.faq-answer`)
- `font-family` → `answerFontFamily`
- `font-size` → `answerFontSize`
- `font-weight` → `answerFontWeight`
- `color` → `answerColor`
- `padding` or `padding-x` → `answerPaddingX`
- `padding-y` → `answerPaddingY`
- `margin` or `margin-x` → `answerMarginX`
- `margin-y` → `answerMarginY`

### Item (`.faq-item`)
- `margin-bottom` or `spacing` → `itemSpacing`
- `border-color` → `borderColor`
- `border-width` → `borderWidth`
- `border-style` → `borderStyle`
- `border` → `borderVisible`

## Example

```css
/* Protect container background from user changes */
/* @protect: background */
.faq-container {
  background: linear-gradient(180deg, #fff 0%, #f0f0f0 100%) !important;
  padding: 32px !important; /* This is still editable */
}

/* Protect all heading typography */
/* @protect: font-family, font-size, font-weight, color */
.faq-heading {
  font-family: "Inter", sans-serif !important;
  font-size: 2.5rem !important;
  font-weight: 700 !important;
  color: #1a1a1a !important;
}

/* Protect question color but allow padding changes */
/* @protect: color */
.faq-question {
  color: #333 !important;
  padding: 16px 24px !important; /* Still editable */
}
```

## How It Works

1. **Parser**: The system parses `@protect` comments from template CSS
2. **Protection Map**: Creates a `TemplateProtection` object with protected properties
3. **CSS Generation**: Skips generating CSS for protected properties
4. **Editor UI**: Disables input controls for protected properties

## Notes

- Properties not listed in `@protect` comments remain editable
- You can protect individual properties (e.g., just `color`) or multiple properties
- The protection system works alongside the existing `!important` detection for backward compatibility
- Higher specificity selectors are used to ensure user customizations override template defaults when not protected
