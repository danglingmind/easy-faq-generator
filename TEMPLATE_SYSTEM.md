# Template System Guide

## How the Template System Works

### Overview

The template system in the FAQ Embed Generator is a **metadata-based system** that allows users to select different visual styles for their FAQ sections. Currently, templates serve as:

1. **Visual presets** - Each template can have different default styling
2. **Access control** - Templates can be locked behind paywalls (`locked: true`)
3. **User selection** - Users choose templates from a dropdown or browse page

### Current Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Template System                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. Template Definition (lib/templates.ts)                │
│     └─> Metadata: id, name, description, locked           │
│                                                           │
│  2. Template Selection (components/inspector-panel.tsx)  │
│     └─> User picks template → updates selectedTemplate    │
│                                                           │
│  3. Style Application (lib/renderer.tsx)                 │
│     └─> Uses styles object to generate HTML/CSS          │
│                                                           │
│  4. Live Preview (components/preview-panel.tsx)          │
│     └─> Renders FAQ in iframe with current styles        │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Key Components

#### 1. Template Definition (`lib/templates.ts`)

Templates are defined as simple metadata objects:

```typescript
{
  id: "minimal",           // Unique identifier
  name: "Minimal",         // Display name
  description: "...",      // User-facing description
  preview: "minimal",      // Preview identifier (currently unused)
  locked: true             // Whether it requires paid tier
}
```

**Current Limitation**: All templates currently use the same `defaultStyles`. The template ID is stored but doesn't affect styling yet.

#### 2. Style System (`lib/types.ts` + `lib/renderer.tsx`)

The actual visual appearance is controlled by the `FAQStyles` object:

- **Typography**: Fonts, sizes, weights, colors for heading, description, question, answer
- **Colors**: Background color/gradient
- **Accordion**: Border styles, padding, margins, animations, icons
- **Spacing**: Section padding, item spacing

The `renderFAQ()` function in `lib/renderer.tsx` takes the `FAQConfig` (which includes `content`, `template`, and `styles`) and generates the final HTML and CSS.

#### 3. Template Selection Flow

```
User selects template
    ↓
handleTemplateChange() called
    ↓
Checks: Is user signed in? Is template locked? Is user paid?
    ↓
Updates selectedTemplate state
    ↓
Preview updates (styles remain the same unless user customizes)
```

### Current Behavior

**Important**: Currently, **templates don't change the styling automatically**. They are:
- ✅ Used for access control (free vs paid)
- ✅ Displayed in the UI for selection
- ✅ Stored in the config
- ❌ **NOT** used to apply different default styles

All templates use the same `defaultStyles` from `lib/templates.ts`. Users can customize styles if they're paid users.

---

## How to Add New Templates

### Step 1: Add Template Metadata

Edit `lib/templates.ts` and add a new template to the `templates` array:

```typescript
export const templates: Template[] = [
  // ... existing templates
  {
    id: "modern",                    // Unique ID (used in URLs)
    name: "Modern",                  // Display name
    description: "Sleek modern design with rounded corners",  // Description shown in UI
    preview: "modern",               // Preview identifier
    locked: true,                    // true = requires paid, false = free
  },
];
```

### Step 2: (Optional) Add Template-Specific Default Styles

Currently, all templates share `defaultStyles`. To make templates visually different, you can:

#### Option A: Create Template-Specific Style Functions

Modify `lib/templates.ts` to include style presets:

```typescript
// Add after defaultStyles
export const templateStyles: Record<string, Partial<FAQStyles>> = {
  minimal: {
    accordion: {
      ...defaultStyles.accordion,
      borderWidth: 0,
      borderVisible: false,
      paddingX: 20,
      paddingY: 16,
    },
    heading: {
      ...defaultStyles.heading,
      fontSize: "XL",
      fontWeight: "Medium",
    },
  },
  card: {
    accordion: {
      ...defaultStyles.accordion,
      borderWidth: 0,
      borderVisible: false,
    },
    backgroundColor: "#f9fafb",
    spacing: {
      ...defaultStyles.spacing,
      sectionPadding: 32,
    },
  },
  // Add your new template
  modern: {
    accordion: {
      ...defaultStyles.accordion,
      borderStyle: "none",
      borderVisible: false,
      paddingX: 24,
      paddingY: 20,
    },
    backgroundColor: "#ffffff",
    heading: {
      ...defaultStyles.heading,
      fontSize: "3XL",
      fontWeight: "Bold",
      color: "#111827",
    },
  },
};

// Helper function to get template styles
export function getTemplateStyles(templateId: string): FAQStyles {
  const templateStyle = templateStyles[templateId];
  if (!templateStyle) {
    return defaultStyles;
  }
  
  // Deep merge with defaultStyles
  return {
    ...defaultStyles,
    ...templateStyle,
    heading: { ...defaultStyles.heading, ...templateStyle.heading },
    description: { ...defaultStyles.description, ...templateStyle.description },
    question: { ...defaultStyles.question, ...templateStyle.question },
    answer: { ...defaultStyles.answer, ...templateStyle.answer },
    accordion: { ...defaultStyles.accordion, ...templateStyle.accordion },
    spacing: { ...defaultStyles.spacing, ...templateStyle.spacing },
  };
}
```

#### Option B: Update Editor to Apply Template Styles

Modify `components/editor-page.tsx` to apply template styles when template changes:

```typescript
// In editor-page.tsx, update handleTemplateChange:
const handleTemplateChange = useCallback((templateId: string) => {
  const template = templates.find((t) => t.id === templateId);
  if (!template) return;

  // ... existing access checks ...

  setSelectedTemplate(templateId);
  
  // Apply template-specific styles (if you implemented Option A)
  if (templateId !== "default") {
    const templateStyle = getTemplateStyles(templateId);
    setStyles(templateStyle);
  }
}, [isPaid, isSignedIn, router]);
```

### Step 3: Test Your Template

1. **Start the dev server**: `npm run dev`
2. **Navigate to** `/templates` to see your new template
3. **Select the template** and verify:
   - It appears in the dropdown
   - Access control works (locked templates require payment)
   - Preview updates correctly
   - Styles apply if you implemented template-specific styles

### Step 4: (Optional) Add Template Preview Images

Currently, templates don't have preview images. To add them:

1. Create preview images (e.g., `public/templates/modern-preview.png`)
2. Update the `Template` type in `lib/types.ts`:

```typescript
export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  previewImage?: string;  // Add this
  locked: boolean;
}
```

3. Update `app/templates/page.tsx` to display preview images

---

## Template System Enhancement Ideas

### 1. Template-Specific Default Styles

As shown in Step 2, you can create different style presets for each template so they look visually distinct.

### 2. Template Preview System

Add preview images or live previews in the templates browse page.

### 3. Template Categories

Group templates by category (e.g., "Minimal", "Bold", "Professional"):

```typescript
export interface Template {
  id: string;
  name: string;
  description: string;
  category?: "minimal" | "bold" | "professional";
  preview: string;
  locked: boolean;
}
```

### 4. Template Presets Database

Store templates in the database instead of a static file for easier management.

---

## Current Template List

| ID | Name | Description | Locked |
|----|------|-------------|--------|
| `default` | Default | Clean and simple accordion layout | ❌ Free |
| `minimal` | Minimal | Minimalist design with subtle borders | ✅ Paid |
| `card` | Card | Card-based layout with shadows | ✅ Paid |
| `bordered` | Bordered | Strong borders and clear separation | ✅ Paid |

---

## File Reference

- **Template Definitions**: `lib/templates.ts`
- **Template Types**: `lib/types.ts` (Template interface)
- **Template Selection UI**: `components/inspector-panel.tsx`
- **Templates Browse Page**: `app/templates/page.tsx`
- **Style Rendering**: `lib/renderer.tsx`
- **Editor Logic**: `components/editor-page.tsx`

---

## Quick Start: Adding a New Template

```typescript
// 1. Edit lib/templates.ts
export const templates: Template[] = [
  // ... existing
  {
    id: "my-template",
    name: "My Template",
    description: "My awesome template",
    preview: "my-template",
    locked: false,  // or true for paid
  },
];
```

That's it! The template will appear in the UI immediately. For visual differences, implement template-specific styles as shown in Step 2.
