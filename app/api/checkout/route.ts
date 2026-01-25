import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { stripe, PRICE_ID, getStripeUrls } from "@/lib/stripe";
import { getUserSubscription, createOrUpdateUserSubscription } from "@/lib/db/queries";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user already has an active subscription
    const existingSubscription = await getUserSubscription(userId);
    if (existingSubscription?.isPaid) {
      return NextResponse.json(
        { error: "User already has an active subscription" },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    let customerId = existingSubscription?.stripeCustomerId;
    
    if (!customerId) {
      // Get user email from Clerk (you might need to fetch this)
      const customer = await stripe.customers.create({
        metadata: {
          clerkUserId: userId,
        },
      });
      customerId = customer.id;

      // Save customer ID to database
      await createOrUpdateUserSubscription(userId, {
        stripeCustomerId: customerId,
      });
    }

    // Parse request body for coupon code
    const body = await request.json();
    const couponCode = body.couponCode?.trim() || null;

    // Validate coupon if provided
    if (couponCode) {
      try {
        const coupon = await stripe.coupons.retrieve(couponCode);
        if (!coupon.valid) {
          return NextResponse.json(
            { error: "Invalid coupon code" },
            { status: 400 }
          );
        }
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid coupon code" },
          { status: 400 }
        );
      }
    }

    // Create checkout session
    const { successUrl, cancelUrl } = getStripeUrls();
    
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      mode: "payment", // One-time payment
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        clerkUserId: userId,
      },
    };

    // Add coupon if provided
    if (couponCode) {
      sessionParams.discounts = [
        {
          coupon: couponCode,
        },
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
