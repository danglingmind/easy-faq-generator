import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserSubscription } from "@/lib/db/queries";
import { isPaidFeaturesEnabled } from "@/lib/utils";

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
