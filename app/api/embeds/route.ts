import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createOrUpdateEmbed, getUserSubscription, getUserEmbeds } from "@/lib/db/queries";
import { FAQConfig } from "@/lib/types";
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

    const userEmbeds = await getUserEmbeds(userId);

    // Return embeds with summary info (without full rendered content for list view)
    const embedsList = userEmbeds.map((embed) => ({
      id: embed.id,
      config: embed.config,
      createdAt: embed.createdAt,
      updatedAt: embed.updatedAt,
      // Include a preview of the config for display
      preview: {
        heading: (embed.config as FAQConfig).content?.heading || "",
        template: (embed.config as FAQConfig).template || "",
        itemCount: (embed.config as FAQConfig).content?.items?.length || 0,
      },
    }));

    return NextResponse.json({
      embeds: embedsList,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching embeds:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const config: FAQConfig = body.config;
    const rendered = body.rendered;

    if (!config) {
      return NextResponse.json(
        { error: "Config is required" },
        { status: 400 }
      );
    }

    // Check if user is paid
    let isPaid = isPaidFeaturesEnabled();
    if (!isPaid) {
      const subscription = await getUserSubscription(userId);
      isPaid = subscription?.isPaid || false;
    }

    // Create or update embed based on paid status
    const { embed, reused } = await createOrUpdateEmbed(userId, config, rendered, isPaid);

    return NextResponse.json({
      embedId: embed.id,
      success: true,
      reused,
    });
  } catch (error) {
    console.error("Error creating embed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
