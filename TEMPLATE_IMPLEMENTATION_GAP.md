# Template System Implementation Gap Analysis

## Current vs. Design Document

### ❌ What's Missing

| Design Document Requirement | Current Implementation | Status |
|---------------------------|----------------------|--------|
| Templates stored in object store (S3/Blob) | Templates are metadata in `lib/templates.ts` | ❌ Not implemented |
| Backend API to list/return templates | No API - hardcoded in frontend | ❌ Not implemented |
| Different HTML structures per template | Single HTML generator for all templates | ❌ Not implemented |
| Template files with placeholders | No template files, just style config | ❌ Not implemented |
| Load HTML into iframe from storage | Generate HTML dynamically from styles | ❌ Not implemented |

### ✅ What's Currently Working

- Template selector UI
- Template metadata (id, name, description, locked)
- Access control (free vs paid)
- Live preview in iframe
- Style editor panel
- HTML/CSS generation

### 🔄 What Needs to Change

1. **Template Storage System**
   - Create template HTML files
   - Store in `public/templates/` or object storage
   - Each template has unique HTML structure

2. **Backend API**
   - `GET /api/templates` - List all templates
   - `GET /api/templates/[id]` - Get template HTML/CSS/JS

3. **Template Loader**
   - Load template HTML when selected
   - Replace current `renderFAQ()` approach
   - Support placeholders for content injection

4. **Template Structure**
   - Each template has its own HTML file
   - Templates can have different layouts (not just styles)
   - Support for different component structures

## Proposed Implementation Plan

### Phase 1: Template File Structure
```
public/templates/
  ├── default/
  │   ├── template.html
  │   ├── template.css
  │   └── template.js
  ├── minimal/
  │   ├── template.html
  │   ├── template.css
  │   └── template.js
  └── card/
      ├── template.html
      ├── template.css
      └── template.js
```

### Phase 2: Backend API
```typescript
// app/api/templates/route.ts
GET /api/templates → List all templates

// app/api/templates/[id]/route.ts
GET /api/templates/[id] → Return template HTML/CSS/JS
```

### Phase 3: Template Loader
```typescript
// lib/template-loader.ts
export async function loadTemplate(templateId: string) {
  // Fetch template files from API
  // Return HTML, CSS, JS
}
```

### Phase 4: Content Injection
```typescript
// Replace placeholders in template HTML
// {{heading}}, {{description}}, {{items}}
```

### Phase 5: Update Renderer
```typescript
// lib/renderer.tsx
// Instead of generating HTML, load template and inject content
```

## Migration Strategy

1. Keep current system working
2. Add new template system alongside
3. Migrate templates one by one
4. Switch renderer to use template files
5. Remove old style-based generation

## Questions to Answer

1. **Storage**: Use `public/templates/` (static) or object storage (S3/Blob)?
2. **Template Format**: HTML files with placeholders or JSON config?
3. **Backward Compatibility**: Keep old system or break it?
4. **Template Editor**: Allow users to create custom templates?
