import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { createOrUpdateUserSubscription } from "@/lib/db/queries";
import Stripe from "stripe";

// STRIPE_WEBHOOK_SECRET is set via Fly.io secrets at runtime
// Fallback value allows build to complete even if STRIPE_WEBHOOK_SECRET is not set
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  // Validate webhook secret at runtime (not during build)
  if (!webhookSecret || webhookSecret === "whsec_dummy_for_build_time_only") {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not configured" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  try {
    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Only process if payment was successful
        if (session.payment_status === "paid") {
          const userId = session.metadata?.clerkUserId;
          
          if (!userId) {
            console.error("No clerkUserId in session metadata");
            break;
          }

          // Update user subscription
          await createOrUpdateUserSubscription(userId, {
            isPaid: true,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string | undefined,
            purchasedAt: new Date(),
          });

          console.log(`Payment successful for user ${userId}`);
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("PaymentIntent succeeded:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("PaymentIntent failed:", paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
