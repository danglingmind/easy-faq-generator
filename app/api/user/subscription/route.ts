import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserSubscription, createOrUpdateUserSubscription } from "@/lib/db/queries";
import { isPaidFeaturesEnabled } from "@/lib/utils";
import { stripe } from "@/lib/stripe";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if paid features are enabled via env var
    if (isPaidFeaturesEnabled()) {
      return NextResponse.json({
        isPaid: true,
        source: "env",
      });
    }

    const subscription = await getUserSubscription(userId);

    // If we have a Stripe customer ID, verify with Stripe
    if (subscription?.stripeCustomerId) {
      try {
        // Check for active payment intents or subscriptions
        const customerId = subscription.stripeCustomerId;
        
        // Check for one-time payments (payment intents)
        const paymentIntents = await stripe.paymentIntents.list({
          customer: customerId,
          limit: 1,
        });

        // Check if there's a successful payment
        const hasSuccessfulPayment = paymentIntents.data.some(
          (pi) => pi.status === "succeeded"
        );

        // Also check checkout sessions
        const sessions = await stripe.checkout.sessions.list({
          customer: customerId,
          limit: 1,
        });

        const hasSuccessfulSession = sessions.data.some(
          (session) => session.payment_status === "paid" && session.status === "complete"
        );

        const isPaidInStripe = hasSuccessfulPayment || hasSuccessfulSession;

        // Sync with database if there's a mismatch
        if (isPaidInStripe !== subscription.isPaid) {
          await createOrUpdateUserSubscription(userId, {
            isPaid: isPaidInStripe,
          });
        }

        return NextResponse.json({
          isPaid: isPaidInStripe,
          source: "stripe",
        });
      } catch (stripeError) {
        console.error("Error checking Stripe:", stripeError);
        // Fall back to database value
        return NextResponse.json({
          isPaid: subscription?.isPaid || false,
          source: "database",
        });
      }
    }

    return NextResponse.json({
      isPaid: subscription?.isPaid || false,
      source: "database",
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
