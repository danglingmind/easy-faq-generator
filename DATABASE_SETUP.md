# Database Setup Guide

## Neon DB Integration with Drizzle ORM

This project uses **Neon DB** (PostgreSQL) with **Drizzle ORM** for cloud-agnostic database operations.

## Setup Steps

### 1. Create Neon Database

1. Go to https://neon.tech
2. Create a new account or sign in
3. Create a new project
4. Copy the connection string (it will look like: `postgresql://user:password@host/database?sslmode=require`)

### 2. Set Environment Variables

Add to your `.env.local`:

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

### 3. Generate and Run Migrations

```bash
# Generate migration files from schema
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

### 4. Database Schema

The database includes three main tables:

#### `embeds`
- Stores FAQ embed configurations
- Fields: `id`, `user_id`, `config` (JSONB), `created_at`, `updated_at`

#### `user_usage`
- Tracks user embed copy usage
- Fields: `id`, `user_id`, `embed_copied`, `embed_copy_count`, `created_at`, `updated_at`

#### `user_subscriptions`
- Tracks user payment/subscription status
- Fields: `id`, `user_id`, `is_paid`, `stripe_customer_id`, `stripe_subscription_id`, `purchased_at`, `created_at`, `updated_at`

## API Endpoints

### Create Embed
```
POST /api/embeds
Body: { config: FAQConfig }
Returns: { embedId: string, success: boolean }
```

### Get Embed (Public)
```
GET /api/public/embed/[embedId]
Returns: { html, css, schema, integrity }
```

### User Usage
```
GET /api/user/usage
Returns: { usage: { embedCopied, embedCopyCount } }

POST /api/user/usage
Body: { embedCopied?: boolean, embedCopyCount?: number }
```

### User Subscription
```
GET /api/user/subscription
Returns: { isPaid: boolean, source: string }
```

## Development Commands

```bash
# Generate migration files
npm run db:generate

# Push schema changes (dev)
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## Notes

- Drizzle ORM is cloud-agnostic - can switch from Neon to any PostgreSQL provider
- All database operations are type-safe
- Migrations are version-controlled
- Schema is defined in `lib/db/schema.ts`
