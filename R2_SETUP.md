# Cloudflare R2 Setup Guide

This guide will help you set up Cloudflare R2 for storing FAQ templates.

## Prerequisites

1. A Cloudflare account (sign up at https://dash.cloudflare.com)
2. R2 bucket created in Cloudflare dashboard

## Setup Steps

### 1. Create R2 Bucket

1. Go to https://dash.cloudflare.com
2. Navigate to **R2** in the sidebar
3. Click **Create bucket**
4. Enter bucket name: `faq-templates` (or your preferred name)
5. Click **Create bucket**

### 2. Create R2 API Token

1. In R2 dashboard, go to **Manage R2 API Tokens**
2. Click **Create API token**
3. Configure:
   - **Token name**: `faq-templates-token`
   - **Permissions**: 
     - **Object Read & Write** (for uploads)
     - **Object Read** (for serving templates)
   - **TTL**: Optional (leave blank for no expiration)
4. Click **Create API Token**
5. **Save the credentials** - you'll need:
   - Access Key ID
   - Secret Access Key

### 3. Get Account ID

1. In Cloudflare dashboard, go to any domain
2. The **Account ID** is shown in the right sidebar
3. Copy this value

### 4. Set Environment Variables

Add to your `.env.local` file:

```env
# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your_account_id_here
R2_ACCESS_KEY_ID=your_access_key_id_here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here
R2_BUCKET_NAME=faq-templates
R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
```

**Note**: The `R2_ENDPOINT` is optional - it will be auto-generated if not provided.

### 5. Upload Templates to R2

#### Option A: Using the Upload Script

1. Make sure template files exist in `templates/` directory:
   ```
   templates/
     ├── default/
     │   ├── template.html
     │   └── template.css
     ├── minimal/
     │   ├── template.html
     │   └── template.css
     └── ...
   ```

2. Install tsx (if not already installed):
   ```bash
   npm install -D tsx
   ```

3. Run the upload script:
   ```bash
   npx tsx scripts/upload-templates.ts
   ```

#### Option B: Manual Upload via Cloudflare Dashboard

1. Go to your R2 bucket in Cloudflare dashboard
2. Click **Upload**
3. Upload files with this structure:
   ```
   default/template.html
   default/template.css
   minimal/template.html
   minimal/template.css
   ...
   ```

### 6. Verify Templates

1. Check R2 bucket - you should see folders for each template
2. Test the API:
   ```bash
   curl http://localhost:3000/api/templates
   ```

## Template File Structure

Each template should have:

```
template-id/
  ├── template.html    (required)
  ├── template.css     (required)
  └── template.js      (optional)
```

### Template HTML Placeholders

Templates support these placeholders:

- `{{heading}}` - FAQ section heading
- `{{description}}` - FAQ section description
- `{{items}}` - FAQ items HTML
- `{{styles}}` - CSS styles (injected in `<head>`)
- `{{jsonLd}}` - JSON-LD schema script

### Example Template HTML

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
</body>
</html>
```

## API Endpoints

### GET `/api/templates`

Lists all available templates with metadata.

**Response:**
```json
{
  "templates": [
    {
      "id": "default",
      "name": "Default",
      "description": "...",
      "locked": false,
      "available": true
    }
  ]
}
```

### GET `/api/templates/[id]`

Gets template HTML, CSS, and JS files.

**Response:**
```json
{
  "html": "<!DOCTYPE html>...",
  "css": ".faq-container {...}",
  "js": "function toggleFAQ() {...}" // optional
}
```

## Fallback Behavior

If R2 is not configured or a template is missing:

- **Default template**: Uses built-in fallback generator
- **Other templates**: Falls back to default template with warning

## Troubleshooting

### Templates Not Loading

1. Check R2 credentials in `.env.local`
2. Verify bucket name matches `R2_BUCKET_NAME`
3. Check template files exist in R2 bucket
4. Review server logs for errors

### Upload Script Fails

1. Verify R2 credentials are correct
2. Check bucket permissions
3. Ensure template files exist in `templates/` directory
4. Check file paths are correct

### API Returns 404

1. Verify template ID exists in `lib/templates.ts`
2. Check template files are uploaded to R2
3. Verify bucket name and credentials

## Production Checklist

- [ ] R2 bucket created
- [ ] API token created with proper permissions
- [ ] Environment variables set in production
- [ ] Templates uploaded to R2
- [ ] API endpoints tested
- [ ] Fallback behavior verified
- [ ] Error handling tested

## Cost Considerations

Cloudflare R2 pricing:
- **Storage**: $0.015 per GB/month
- **Class A Operations** (writes): $4.50 per million
- **Class B Operations** (reads): $0.36 per million
- **Egress**: Free (unlike S3)

For FAQ templates (small files, mostly reads), costs should be minimal.
