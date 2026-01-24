import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
});

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
