# Fly.io Deployment Guide

This guide will help you deploy the Easy FAQ Generator to Fly.io in the BOM (Mumbai) region.

## Prerequisites

1. Install [flyctl](https://fly.io/docs/getting-started/installing-flyctl/)
2. Sign up for a [Fly.io account](https://fly.io/app/sign-up)
3. Login to Fly.io: `flyctl auth login`

## Initial Setup

### 1. Launch the App (First Time Only)

If this is your first deployment, run:

```bash
flyctl launch
```

When prompted:
- **App name**: Choose a unique name or use the default `easy-faq-generator`
- **Region**: Select `bom` (Mumbai, India)
- **Postgres**: Skip (you're using Neon)
- **Redis**: Skip (not needed)
- **Deploy now**: Choose `No` (we'll set up secrets first)

### 2. Set Environment Variables and Secrets

The app requires several environment variables. Set them using `flyctl secrets set`:

#### Required Secrets (Sensitive Data)

```bash
# Database
flyctl secrets set DATABASE_URL="your-neon-database-url"

# Clerk Authentication
flyctl secrets set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
flyctl secrets set CLERK_SECRET_KEY="your-clerk-secret-key"

# Stripe
flyctl secrets set STRIPE_SECRET_KEY="your-stripe-secret-key"
flyctl secrets set STRIPE_PRICE_ID="your-stripe-price-id"

# Cloudflare R2 (Optional - for template storage)
flyctl secrets set R2_ACCESS_KEY_ID="your-r2-access-key"
flyctl secrets set R2_SECRET_ACCESS_KEY="your-r2-secret-key"
flyctl secrets set R2_ACCOUNT_ID="your-r2-account-id"
# OR
flyctl secrets set R2_ENDPOINT="https://your-account-id.r2.cloudflarestorage.com"
flyctl secrets set R2_BUCKET_NAME="faq-templates"
```

#### Public Environment Variables

Set these in `fly.toml` under `[env]` or via CLI:

```bash
# App URL (update after first deployment)
flyctl secrets set NEXT_PUBLIC_APP_URL="https://your-app-name.fly.dev"

# Optional: Enable paid features
flyctl secrets set NEXT_PUBLIC_ENABLE_PAID_FEATURES="true"
```

### 3. Run Database Migrations (First Time)

Before deploying, ensure your database schema is up to date. Run migrations locally or on a one-off Fly.io machine:

**Option 1: Run locally (recommended)**
```bash
# Make sure DATABASE_URL is set in your local .env
npm run db:migrate
```

**Option 2: Run on Fly.io (one-off machine)**
```bash
# Create a one-off machine to run migrations
flyctl ssh console -C "npm run db:migrate"
```

> **Note**: Drizzle ORM doesn't require client generation (unlike Prisma). The schema files are TypeScript that get compiled automatically during the build. Only migrations need to be run separately.

### 4. Deploy

Deploy your application:

```bash
flyctl deploy
```

This will:
- Build your Docker image
- Push it to Fly.io
- Deploy to the BOM region
- Start your application

### 5. Update App URL

After the first deployment, update your app URL:

```bash
# Get your app URL
flyctl status

# Update the NEXT_PUBLIC_APP_URL secret
flyctl secrets set NEXT_PUBLIC_APP_URL="https://your-actual-app-name.fly.dev"
```

Also update this in:
- Clerk Dashboard → Settings → Frontend API → Allowed Origins
- Stripe Dashboard → Webhooks → Endpoint URL

## Configuration Files

### Dockerfile

The Dockerfile follows Fly.io best practices:
- Multi-stage build for smaller image size
- Uses Node.js 20 Alpine for minimal footprint
- Leverages Next.js standalone output
- Runs as non-root user for security

### fly.toml

The configuration includes:
- **Primary region**: `bom` (Mumbai)
- **Auto-scaling**: Machines auto-start/stop based on traffic
- **Health checks**: Automatic health monitoring
- **Resource allocation**: 1 shared CPU, 512MB RAM (adjustable)

### Scaling

To scale your application:

```bash
# Scale to multiple instances
flyctl scale count 2

# Increase memory
flyctl scale vm shared-cpu-1x --memory 1024

# View current status
flyctl status
```

## Monitoring

### View Logs

```bash
# Real-time logs
flyctl logs

# Follow logs
flyctl logs -a your-app-name
```

### Check Status

```bash
flyctl status
flyctl info
```

### SSH into Instance

```bash
flyctl ssh console
```

## Database Migrations

### Running Migrations

Drizzle ORM doesn't require client generation - the schema is TypeScript that gets compiled automatically. However, you need to run SQL migrations separately:

**Before first deployment:**
```bash
# Run migrations locally (recommended)
npm run db:migrate
```

**After deployment (if needed):**
```bash
# Create a one-off machine to run migrations
flyctl ssh console -C "npm run db:migrate"
```

**Note**: The `drizzle/` folder with migration files is excluded from the Docker image (via `.dockerignore`) since migrations should be run separately, not at runtime.

### Generating New Migrations

If you update your schema (`lib/db/schema.ts`):

1. Generate migration files locally:
   ```bash
   npm run db:generate
   ```

2. Review the generated SQL in `drizzle/` folder

3. Run migrations:
   ```bash
   npm run db:migrate
   ```

4. Commit the migration files to git

5. Deploy your updated app

## Troubleshooting

### Build Failures

1. Check build logs: `flyctl logs`
2. Test Docker build locally: `docker build -t test .`
3. Verify `.dockerignore` isn't excluding necessary files

### Runtime Errors

1. Check application logs: `flyctl logs`
2. Verify all secrets are set: `flyctl secrets list`
3. Check environment variables: `flyctl ssh console -C "env"`

### Database Connection Issues

1. Verify `DATABASE_URL` is set correctly
2. Check if your Neon database allows connections from Fly.io IPs
3. Test connection: `flyctl ssh console -C "node -e \"console.log(process.env.DATABASE_URL)\""`

## Environment Variables Reference

### Required

- `DATABASE_URL` - Neon database connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `NEXT_PUBLIC_APP_URL` - Your app's public URL

### Optional

- `STRIPE_PRICE_ID` - Stripe price ID for subscriptions
- `R2_ACCESS_KEY_ID` - Cloudflare R2 access key
- `R2_SECRET_ACCESS_KEY` - Cloudflare R2 secret key
- `R2_ACCOUNT_ID` - Cloudflare R2 account ID
- `R2_ENDPOINT` - Cloudflare R2 endpoint URL
- `R2_BUCKET_NAME` - R2 bucket name (default: "faq-templates")
- `NEXT_PUBLIC_ENABLE_PAID_FEATURES` - Enable paid features flag

## Additional Resources

- [Fly.io Documentation](https://fly.io/docs/)
- [Next.js on Fly.io](https://fly.io/docs/js/frameworks/nextjs/)
- [Fly.io Configuration Reference](https://fly.io/docs/reference/configuration/)

## Support

For issues specific to Fly.io, check:
- [Fly.io Community Forum](https://community.fly.io/)
- [Fly.io Status Page](https://status.fly.io/)
