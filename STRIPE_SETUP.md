# Stripe Integration Setup Guide

This guide will help you set up Stripe payments with discount coupon support for the FAQ Embed Generator.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Environment variables configured

## Environment Variables

Add the following to your `.env.local` file:

```env
# Stripe Keys (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe Price ID (create a product/price in Stripe dashboard)
STRIPE_PRICE_ID=price_...

# Stripe Webhook Secret (get from webhook endpoint in Stripe dashboard)
STRIPE_WEBHOOK_SECRET=whsec_...

# App URL (for redirect URLs)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setup Steps

### 1. Create a Product and Price in Stripe

1. Go to https://dashboard.stripe.com/products
2. Click "Add product"
3. Set product name (e.g., "FAQ Embed Generator Premium")
4. Set pricing:
   - **Pricing model**: One-time
   - **Price**: Set your desired amount
   - **Currency**: USD (or your preferred currency)
5. Click "Save product"
6. Copy the **Price ID** (starts with `price_`) and add it to `STRIPE_PRICE_ID` in your `.env.local`

### 2. Create Discount Coupons (Optional)

1. Go to https://dashboard.stripe.com/coupons
2. Click "Create coupon"
3. Configure:
   - **Name**: e.g., "LAUNCH20"
   - **Discount type**: Percentage or Fixed amount
   - **Value**: e.g., 20% or $10
   - **Duration**: Once (for one-time payments)
   - **Redemption limits**: Optional
4. Click "Create coupon"
5. The coupon code can now be used during checkout

### 3. Set Up Webhook Endpoint

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Configure:
   - **Endpoint URL**: `https://yourdomain.com/api/webhooks/stripe`
   - **Events to listen to**: Select these events:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
4. Click "Add endpoint"
5. Copy the **Signing secret** (starts with `whsec_`) and add it to `STRIPE_WEBHOOK_SECRET` in your `.env.local`

### 4. Test the Integration

#### Using Stripe Test Mode

1. Make sure you're using test API keys (they start with `sk_test_` and `pk_test_`)
2. Use Stripe test cards:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - Use any future expiry date and any 3-digit CVC
3. Test coupon codes you created in test mode

#### Testing Locally

For local webhook testing, use Stripe CLI:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This will give you a webhook signing secret that starts with `whsec_` - use this for local testing.

## How It Works

### Checkout Flow

1. User clicks "Upgrade" button
2. Checkout dialog opens with optional coupon code input
3. User enters coupon code (optional) and clicks "Continue to Checkout"
4. User is redirected to Stripe Checkout
5. After payment:
   - **Success**: Redirects to `/?payment=success`
   - **Cancel**: Redirects to `/?payment=cancelled`

### Webhook Processing

1. Stripe sends webhook event when payment completes
2. Webhook handler verifies signature
3. Updates user subscription in database:
   - Sets `isPaid = true`
   - Stores `stripeCustomerId` and `stripeSubscriptionId`
   - Records `purchasedAt` timestamp

### Subscription Verification

The subscription API checks:
1. Environment variable bypass (`NEXT_PUBLIC_ENABLE_PAID_FEATURES`)
2. Database record
3. Stripe API (verifies active payments)

## API Endpoints

### POST `/api/checkout`

Creates a Stripe Checkout session.

**Request:**
```json
{
  "couponCode": "LAUNCH20" // optional
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

### POST `/api/webhooks/stripe`

Handles Stripe webhook events. Called by Stripe automatically.

### GET `/api/user/subscription`

Returns user's paid status.

**Response:**
```json
{
  "isPaid": true,
  "source": "stripe" // or "database" or "env"
}
```

## Features

✅ One-time payment support  
✅ Discount coupon codes  
✅ Webhook-based subscription updates  
✅ Stripe API verification  
✅ Payment success/cancel handling  
✅ Automatic subscription status refresh  

## Troubleshooting

### Webhook Not Firing

- Verify webhook endpoint URL is correct
- Check webhook secret matches
- Ensure events are selected in Stripe dashboard
- Check server logs for errors

### Payment Not Updating Subscription

- Check webhook is receiving events
- Verify webhook secret is correct
- Check database connection
- Review webhook handler logs

### Coupon Not Working

- Verify coupon exists in Stripe dashboard
- Check coupon is active and not expired
- Ensure coupon is valid for the price/product
- Check coupon code is entered correctly (case-sensitive)

## Production Checklist

- [ ] Switch to live API keys (`sk_live_` and `pk_live_`)
- [ ] Update webhook endpoint to production URL
- [ ] Test with real payment (small amount)
- [ ] Verify webhook events are received
- [ ] Set up monitoring/alerting for webhook failures
- [ ] Configure proper error handling and logging
