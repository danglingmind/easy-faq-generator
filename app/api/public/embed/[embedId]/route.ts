import { NextRequest, NextResponse } from "next/server";
import { renderFAQ } from "@/lib/renderer";
import { FAQConfig } from "@/lib/types";
import { getEmbedById, getUserSubscription } from "@/lib/db/queries";
import { isPaidFeaturesEnabled } from "@/lib/utils";

async function getEmbedConfig(embedId: string): Promise<FAQConfig | null> {
  const embed = await getEmbedById(embedId);
  if (!embed) return null;

  return embed.config as FAQConfig;
}

async function assertLicenseValid(userId: string): Promise<boolean> {
  // Check if paid features are enabled via env var
  if (isPaidFeaturesEnabled()) {
    return true;
  }

  // Check database for subscription
  const subscription = await getUserSubscription(userId);
  return subscription?.isPaid || false;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ embedId: string }> }
) {
  try {
    const { embedId } = await params;

    const embed = await getEmbedById(embedId);
    if (!embed) {
      return NextResponse.json(
        { error: "Embed not found" },
        { status: 404 }
      );
    }

    const config = embed.config as FAQConfig;

    // Validate license
    const isValid = await assertLicenseValid(embed.userId);
    if (!isValid) {
      return NextResponse.json(
        { error: "License validation failed" },
        { status: 403 }
      );
    }

    const { html, css } = renderFAQ(config);

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: config.content.items.map((item) => ({
        "@type": "Question",
        name: item.question || "",
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer || "",
        },
      })),
    };

    // Generate integrity hash (simplified)
    const payload = JSON.stringify({ html, css, schema: jsonLd });
    const integrity = Buffer.from(payload).toString("base64").slice(0, 16);

    return NextResponse.json({
      html,
      css,
      schema: jsonLd,
      integrity,
    });
  } catch (error) {
    console.error("Embed generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
