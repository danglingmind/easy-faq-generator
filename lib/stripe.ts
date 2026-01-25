import Stripe from "stripe";

// STRIPE_SECRET_KEY is set via Fly.io secrets at runtime
// For local development, set it in .env.local
// Fallback value allows build to complete even if STRIPE_SECRET_KEY is not set
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Use the STRIPE_SECRET_KEY with fallback for build-time module evaluation
export const stripe = new Stripe(
  stripeSecretKey || "sk_test_dummy_key_for_build_time_only",
  {
    apiVersion: "2025-12-15.clover",
    typescript: true,
  }
);

// Price ID for the one-time purchase
// This should be set in your Stripe dashboard and added to .env
export const PRICE_ID = process.env.STRIPE_PRICE_ID || "";

// Success and cancel URLs
export const getStripeUrls = () => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return {
    successUrl: `${baseUrl}/?payment=success`,
    cancelUrl: `${baseUrl}/?payment=cancelled`,
  };
};
