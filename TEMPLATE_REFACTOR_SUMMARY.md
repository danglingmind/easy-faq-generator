# Template System Refactor Summary

## ✅ Complete Refactor Completed

The template system has been fully refactored to match the design document requirements using Cloudflare R2 for object storage.

## What Changed

### Before (Style-Based System)
- Templates were metadata only
- All templates used the same HTML structure
- Styles were generated dynamically
- No template files stored

### After (Template-Based System)
- Templates are actual HTML/CSS/JS files stored in R2
- Each template can have unique HTML structure
- Templates loaded from R2 via API
- Placeholder system for content injection
- Dynamic styles overlay template base styles

## New Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Template System (R2-Based)                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Template Storage (Cloudflare R2)                    │
│     └─> HTML/CSS/JS files per template                  │
│                                                          │
│  2. Backend API                                          │
│     ├─> GET /api/templates → List templates             │
│     └─> GET /api/templates/[id] → Get template files    │
│                                                          │
│  3. Template Loader (lib/template-loader.ts)            │
│     └─> Injects content into template placeholders       │
│                                                          │
│  4. Dynamic Styles (lib/template-styles.ts)              │
│     └─> Applies user customizations over template       │
│                                                          │
│  5. Renderer (lib/renderer-v2.tsx)                      │
│     └─> Loads template + injects content + applies styles│
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## New Files Created

### Core System
- `lib/r2.ts` - Cloudflare R2 client and operations
- `lib/template-loader.ts` - Content injection into templates
- `lib/template-styles.ts` - Dynamic CSS generation
- `lib/renderer-v2.tsx` - New template-based renderer
- `lib/template-fallback.ts` - Fallback for default template

### API Routes
- `app/api/templates/route.ts` - List all templates
- `app/api/templates/[id]/route.ts` - Get template files

### Template Files
- `templates/default/template.html` - Default template HTML
- `templates/default/template.css` - Default template CSS
- `templates/minimal/template.html` - Minimal template HTML
- `templates/minimal/template.css` - Minimal template CSS
- `templates/card/template.html` - Card template HTML
- `templates/card/template.css` - Card template CSS
- `templates/bordered/template.html` - Bordered template HTML
- `templates/bordered/template.css` - Bordered template CSS

### Scripts & Docs
- `scripts/upload-templates.ts` - Upload templates to R2
- `R2_SETUP.md` - R2 setup guide
- `TEMPLATE_REFACTOR_SUMMARY.md` - This file

## Updated Files

- `components/preview-panel.tsx` - Now loads templates from API
- `app/api/public/embed/[embedId]/route.ts` - Uses new renderer
- `lib/renderer.tsx` - Marked as legacy (kept for compatibility)

## Template Placeholders

Templates support these placeholders:

- `{{heading}}` - FAQ section heading
- `{{description}}` - FAQ section description
- `{{items}}` - FAQ items HTML
- `{{styles}}` - CSS styles (injected in `<head>`)
- `{{jsonLd}}` - JSON-LD schema script

## How It Works

1. **Template Selection**: User selects a template
2. **Template Loading**: System fetches template HTML/CSS/JS from R2 via API
3. **Content Injection**: Template loader injects user content into placeholders
4. **Style Application**: Dynamic styles overlay template base styles
5. **Rendering**: Final HTML is generated and displayed in preview

## Environment Variables Required

```env
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=faq-templates
R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
```

## Uploading Templates

1. Create template files in `templates/[template-id]/`
2. Run upload script:
   ```bash
   npm run templates:upload
   ```

## Fallback Behavior

- If R2 is not configured: Uses built-in fallback for default template
- If template missing: Falls back to default template with warning
- If API fails: Uses cached template or fallback

## Migration Notes

- Old `renderFAQ()` still works (marked as legacy)
- New code should use `renderFAQ()` from `renderer-v2.tsx`
- Preview panel automatically uses new system
- Embed API uses new system

## Next Steps

1. **Set up R2**: Follow `R2_SETUP.md`
2. **Upload templates**: Run `npm run templates:upload`
3. **Test templates**: Verify each template loads correctly
4. **Customize templates**: Edit HTML/CSS files and re-upload

## Benefits

✅ **True template system** - Different HTML structures per template  
✅ **Scalable** - Easy to add new templates  
✅ **Flexible** - Templates can have unique layouts  
✅ **Maintainable** - Template files separate from code  
✅ **Cloud storage** - Templates served from R2 CDN  

## Backward Compatibility

- Old renderer (`lib/renderer.tsx`) still available
- Existing embeds continue to work
- Gradual migration possible
