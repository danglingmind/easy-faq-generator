# Template Format Specification

This document defines the standard format for FAQ templates in the Easy FAQ Generator. All templates must follow this specification to ensure consistency and proper integration with the editor and style extraction system.

## Template Structure

Each template consists of three files in a directory named after the template ID:

```
template-id/
  ├── template.html    (required)
  ├── template.css     (required)
  └── template.js      (optional)
```

## CSS Format Standard

### Selector Convention

**All templates MUST use generic class selectors only.** Do not use template-specific selectors like `[data-template="id"]` in your CSS.

#### Required Selectors

Templates must define styles for these core classes:

- `.faq-container` - Main container wrapper
- `.faq-heading` - Section heading (h2)
- `.faq-description` - Section description paragraph
- `.faq-item` - Individual FAQ item container
- `.faq-question` - Question button/heading
- `.faq-answer` - Answer content area
- `.faq-icon` - Accordion icon/indicator

#### Optional Selectors

Templates may define additional selectors for custom layouts:

- `.faq-layout` - Custom layout wrapper (e.g., split layouts)
- `.faq-left`, `.faq-right` - Layout sections
- `.faq-items` - Items container wrapper
- `.faq-heading .heading-line` - Custom heading formatting
- `.faq-heading .highlight` - Highlighted text within heading

### CSS Property Guidelines

#### 1. Use `!important` for Protected Styles

If your template has specific styling that should **not** be overridden by user customizations, use `!important` on those properties.

**When to use `!important`:**
- Template has a distinct visual identity that must be preserved
- Template uses custom layouts or complex styling
- Template has brand-specific colors, fonts, or spacing

**When NOT to use `!important`:**
- Simple templates that should allow user customization
- Templates where user preferences should take precedence

**Rule of thumb:** If your template uses `!important` on more than 3 properties, it will be automatically protected from user customizations.

#### 2. Standard Properties

Define these properties for proper style extraction:

**`.faq-container`:**
- `background` or `background-color` - Container background
- `padding` - Container padding (will be extracted as `sectionPadding`)
- `font-family` - Default font family

**`.faq-heading`:**
- `font-family` - Heading font
- `font-size` - Heading size (will be mapped to: XS, SM, MD, LG, XL, 2XL, 3XL, 4XL)
- `font-weight` - Heading weight (300=Light, 400=Normal, 500=Medium, 600=Semibold, 700=Bold)
- `color` - Heading text color

**`.faq-description`:**
- `font-family` - Description font
- `font-size` - Description size
- `font-weight` - Description weight
- `color` - Description text color

**`.faq-question`:**
- `font-family` - Question font
- `font-size` - Question size
- `font-weight` - Question weight
- `color` - Question text color
- `padding` - Question padding (will be extracted as `paddingX` and `paddingY`)

**`.faq-answer`:**
- `font-family` - Answer font
- `font-size` - Answer size
- `font-weight` - Answer weight
- `color` - Answer text color
- `padding` - Answer padding

**`.faq-item`:**
- `margin-bottom` - Spacing between items (will be extracted as `itemSpacing`)
- `border` or `border-*` - Border styles (will be extracted for accordion border settings)

**⚠️ Important: Border Property Guidelines**

If you want borders to be **editable by users** in the editor:
- **DO NOT** use the shorthand `border` property (e.g., `border: 1px solid #color;`)
- **DO** omit border properties entirely from template CSS, or use individual border sides only if needed
- The dynamic CSS system generates individual border sides (`border-top`, `border-right`, etc.) with `!important`
- The shorthand `border` property can conflict with the dynamic CSS, preventing borders from being properly removed when disabled

**Example - Editable Borders:**
```css
/* ✅ Good - No border in template, fully controlled by dynamic CSS */
.faq-item {
  margin-bottom: 20px;
  overflow: hidden;
}

/* ❌ Bad - Shorthand border prevents dynamic CSS from removing it */
.faq-item {
  border: 1px solid #dddddd; /* This will persist even when borders are disabled */
  margin-bottom: 20px;
}
```

**If you need a default border that should be protected:**
```css
/* ✅ Good - Use @protect to mark border as non-editable */
/* @protect: border-color, border-width, border-style */
.faq-item {
  border: 1px solid rgba(255, 255, 255, 0.25) !important;
  margin-bottom: 20px;
}
```

#### 3. Required States

Always include these state selectors:

```css
.faq-answer[hidden] {
  display: none;
}

.faq-item[data-open="true"] .faq-icon {
  transform: rotate(180deg);
}
```

### Example Template CSS

```css
/* Simple template without !important (allows user customization) */
.faq-container {
  background: #ffffff;
  padding: 24px;
  font-family: system-ui, -apple-system, sans-serif;
}

.faq-heading {
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 1.875rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.faq-description {
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: #4a4a4a;
  margin-bottom: 20px;
}

.faq-item {
  margin-bottom: 20px;
  border: 2px solid #1a1a1a;
  overflow: hidden;
}

.faq-question {
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1a1a;
  padding: 18px;
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
  color: #1a1a1a;
  padding: 18px;
  margin: 0;
  line-height: 1.6;
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
```

```css
/* Protected template with !important (preserves template identity) */
.faq-container {
  background: #153825 !important;
  padding: 56px 64px !important;
  font-family: "Inter", system-ui, -apple-system, sans-serif !important;
}

.faq-heading {
  font-family: "Inter", system-ui, -apple-system, sans-serif !important;
  font-size: 2.75rem !important;
  font-weight: 600 !important;
  color: #f2f5ee !important;
  margin: 0 0 18px 0 !important;
}

/* ... rest of styles with !important ... */
```

```css
/* Protected template using @protect directive (recommended) */
/* @protect: background */
.faq-container {
  background: radial-gradient(
    circle at top,
    rgba(255, 255, 255, 0.06),
    rgba(0, 0, 0, 0.85)
  ),
  url("https://example.com/bg.jpg") center/cover no-repeat !important;
  padding: 72px 64px !important; /* Users can edit padding */
}

/* @protect: font-family, font-size, font-weight, color */
.faq-heading {
  font-family: "Inter", system-ui, -apple-system, sans-serif !important;
  font-size: 2.25rem !important;
  font-weight: 500 !important;
  color: #ffffff !important;
  text-align: center !important;
  margin-bottom: 48px !important; /* Users can edit margin */
}

/* @protect: color */
.faq-question {
  color: #ffffff !important;
  padding: 22px 26px !important; /* Users can edit padding */
  font-size: 1.125rem !important; /* Users can edit font size */
}

/* @protect: border-color, border-style */
.faq-item {
  border: 1px solid rgba(255, 255, 255, 0.25) !important;
  border-radius: 14px !important;
  margin-bottom: 20px !important; /* Users can edit spacing */
}
```

## HTML Format Standard

### Required Structure

Templates must include these placeholders in the HTML:

- `{{heading}}` - FAQ section heading
- `{{description}}` - FAQ section description (optional, will be wrapped in `<p class="faq-description">`)
- `{{items}}` - FAQ items HTML (generated automatically)
- `{{styles}}` - CSS styles (injected in `<head>`)
- `{{jsonLd}}` - JSON-LD schema script (for SEO)

### Required Container

The main container must have the class `faq-container`:

```html
<div class="faq-container">
  <h2 class="faq-heading">{{heading}}</h2>
  {{description}}
  <div class="faq-items">
    {{items}}
  </div>
</div>
```

### Item Structure

The `{{items}}` placeholder will be replaced with HTML that follows this structure:

```html
<div class="faq-item" data-open="false">
  <button
    class="faq-question"
    data-accordion-button
    aria-expanded="false"
    aria-controls="faq-answer-0"
    id="faq-question-0"
  >
    <span>Question text</span>
    <span class="faq-icon">
      <!-- SVG icon -->
    </span>
  </button>
  <div
    class="faq-answer"
    id="faq-answer-0"
    role="region"
    aria-labelledby="faq-question-0"
  >
    Answer text
  </div>
</div>
```

### Custom Layouts

Templates can define custom layouts, but must still use the standard class names:

```html
<div class="faq-container">
  <div class="faq-layout">
    <div class="faq-left">
      <h2 class="faq-heading">{{heading}}</h2>
      {{description}}
    </div>
    <div class="faq-right">
      <div class="faq-items">
        {{items}}
      </div>
    </div>
  </div>
</div>
```

### Complete HTML Template Example

```html
<!DOCTYPE html>
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
    <!-- Accordion functionality (included automatically) -->
  </script>
</body>
</html>
```

## JavaScript (Optional)

Templates may include custom JavaScript in `template.js`. This will be injected before the closing `</body>` tag.

**Note:** The system automatically includes accordion functionality, so custom JS is typically only needed for:
- Custom animations
- Advanced interactions
- Third-party integrations

## Font Size Mapping

When defining `font-size` in CSS, use these rem values for proper editor mapping:

| Editor Size | CSS Value | Example |
|------------|-----------|---------|
| XS         | 0.75rem   | 12px    |
| SM         | 0.875rem  | 14px    |
| MD         | 1rem      | 16px    |
| LG         | 1.125rem  | 18px    |
| XL         | 1.25rem   | 20px    |
| 2XL        | 1.5rem    | 24px    |
| 3XL        | 1.875rem  | 30px    |
| 4XL        | 2.25rem+  | 36px+   |

## Font Weight Mapping

| Editor Label | CSS Value | Numeric |
|-------------|-----------|---------|
| Light       | 300       | 300     |
| Normal      | 400       | 400     |
| Medium      | 500       | 500     |
| Semibold    | 600       | 600     |
| Bold        | 700       | 700     |

## Style Extraction

The system automatically extracts styles from your template CSS using these selectors:

1. **Primary:** Generic selectors (`.faq-container`, `.faq-heading`, etc.)
2. **Fallback:** Template-specific selectors (`.faq-container[data-template="id"]`)

**Important:** Always use generic selectors in your CSS. The system will try generic selectors first, ensuring your styles are always extracted correctly.

## Template Protection

### Automatic Protection (Legacy)

Templates are automatically protected from user customizations if:

- The template CSS contains more than 3 `!important` declarations
- This indicates the template has a strong visual identity that should be preserved

Protected templates will:
- ✅ Have their base styles preserved
- ✅ Still allow some user customizations (spacing, borders, animations)
- ❌ Prevent overriding of colors, fonts, and sizes

### Granular Property Protection (Recommended)

You can now mark specific properties as protected using CSS comments with the `@protect` directive. This gives you fine-grained control over which properties users can edit.

#### Syntax

Add a `/* @protect: property1, property2 */` comment directly before a CSS selector:

```css
/* @protect: background-color */
.faq-container {
  background: linear-gradient(180deg, #fff 0%, #f0f0f0 100%) !important;
  padding: 32px !important; /* This is still editable */
}

/* @protect: font-family, font-size, font-weight, color */
.faq-heading {
  font-family: "Inter", sans-serif !important;
  font-size: 2.5rem !important;
  font-weight: 700 !important;
  color: #1a1a1a !important;
}
```

#### Supported Properties

**Container (`.faq-container`):**
- `background` or `background-color` → Protects container background
- `padding` → Protects section padding

**Heading (`.faq-heading`):**
- `font-family` → Protects heading font family
- `font-size` → Protects heading font size
- `font-weight` → Protects heading font weight
- `color` → Protects heading text color

**Description (`.faq-description`):**
- `font-family` → Protects description font family
- `font-size` → Protects description font size
- `font-weight` → Protects description font weight
- `color` → Protects description text color

**Question (`.faq-question`):**
- `font-family` → Protects question font family
- `font-size` → Protects question font size
- `font-weight` → Protects question font weight
- `color` → Protects question text color
- `padding` or `padding-x` → Protects horizontal padding
- `padding-y` → Protects vertical padding
- `margin` or `margin-x` → Protects horizontal margin
- `margin-y` → Protects vertical margin

**Answer (`.faq-answer`):**
- `font-family` → Protects answer font family
- `font-size` → Protects answer font size
- `font-weight` → Protects answer font weight
- `color` → Protects answer text color
- `padding` or `padding-x` → Protects horizontal padding
- `padding-y` → Protects vertical padding
- `margin` or `margin-x` → Protects horizontal margin
- `margin-y` → Protects vertical margin

**Item (`.faq-item`):**
- `margin-bottom` or `spacing` → Protects item spacing
- `border-color` → Protects border color
- `border-width` → Protects border width
- `border-style` → Protects border style
- `border` → Protects border visibility

#### Example: Protected Template

```css
/* Protect container background but allow padding changes */
/* @protect: background */
.faq-container {
  background: radial-gradient(
    circle at top,
    rgba(255, 255, 255, 0.06),
    rgba(0, 0, 0, 0.85)
  ),
  url("https://example.com/bg.jpg") center/cover no-repeat !important;
  padding: 72px 64px !important; /* Users can still edit this */
}

/* Protect all heading typography */
/* @protect: font-family, font-size, font-weight, color */
.faq-heading {
  font-family: "Inter", system-ui, -apple-system, sans-serif !important;
  font-size: 2.25rem !important;
  font-weight: 500 !important;
  color: #ffffff !important;
  text-align: center !important;
  margin-bottom: 48px !important; /* Users can still edit this */
}

/* Protect question color but allow padding/margin changes */
/* @protect: color */
.faq-question {
  color: #ffffff !important;
  padding: 22px 26px !important; /* Users can edit this */
  margin: 0 !important; /* Users can edit this */
  font-size: 1.125rem !important; /* Users can edit this */
}

/* Protect border color and style but allow width changes */
/* @protect: border-color, border-style */
.faq-item {
  border: 1px solid rgba(255, 255, 255, 0.25) !important;
  border-radius: 14px !important;
  margin-bottom: 20px !important; /* Users can edit spacing */
}
```

#### How It Works

1. **Parser**: The system parses `@protect` comments from your template CSS
2. **Protection Map**: Creates a protection object marking which properties are protected
3. **CSS Generation**: Skips generating CSS for protected properties (they won't be overridden)
4. **Editor UI**: Disables input controls for protected properties (users can't edit them)

#### Benefits

- ✅ **Fine-grained control**: Protect only the properties you need
- ✅ **Better UX**: Users see disabled controls instead of changes not taking effect
- ✅ **Flexible**: Mix protected and editable properties as needed
- ✅ **Backward compatible**: Works alongside the automatic `!important` detection

#### Best Practices

1. **Protect brand identity**: Use `@protect` for colors, fonts, and sizes that define your template's identity
2. **Allow layout flexibility**: Don't protect spacing properties unless necessary
3. **Document intent**: Add comments explaining why properties are protected
4. **Test in editor**: Verify that protected properties are disabled in the editor UI

## Best Practices

1. **Use semantic class names** - Stick to the standard class names
2. **Keep it simple** - Avoid unnecessary complexity
3. **Test extraction** - Verify styles are extracted correctly in the editor
4. **Document custom features** - If using custom selectors, document them
5. **Responsive design** - Include media queries for mobile devices
6. **Accessibility** - Ensure proper contrast ratios and ARIA attributes (handled automatically)
7. **Border properties** - Avoid using the shorthand `border` property on `.faq-item` if you want borders to be editable. The dynamic CSS system uses individual border sides (`border-top`, `border-right`, etc.) and the shorthand can conflict. Omit border properties from template CSS for fully editable borders, or use `@protect` if borders should be fixed.

## Migration Guide

If you have existing templates that don't follow this format:

1. **Remove template-specific selectors** - Change `[data-template="id"]` to generic selectors
2. **Add `!important` if needed** - If template should be protected, add `!important` to key properties
3. **Verify extraction** - Test that styles are extracted correctly in the editor
4. **Update HTML** - Ensure HTML uses standard class names

## Questions?

If you're unsure about any aspect of the template format, refer to existing templates:
- `templates/default/` - Simple, customizable template
- `templates/bordered/` - Template with borders
- `templates/split/` - Protected template with custom layout
- `templates/card/` - Template with card styling
- `templates/minimal/` - Minimal design template
