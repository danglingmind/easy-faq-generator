import { NextRequest, NextResponse } from "next/server";
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

// Helper function to get CORS headers
function getCorsHeaders(origin?: string | null) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, {
    status: 200,
    headers: getCorsHeaders(origin),
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ embedId: string }> }
) {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);
  
  try {
    const { embedId } = await params;

    const embed = await getEmbedById(embedId);
    if (!embed) {
      return NextResponse.json(
        { error: "Embed not found" },
        { 
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    const config = embed.config as FAQConfig;

    // Validate license
    const isValid = await assertLicenseValid(embed.userId);
    if (!isValid) {
      return NextResponse.json(
        { error: "License validation failed" },
        { 
          status: 403,
          headers: corsHeaders,
        }
      );
    }

    let html: string;
    let css: string;
    let jsonLd: Record<string, unknown>;

    if (embed.rendered?.html && embed.rendered?.css && embed.rendered?.schema) {
      html = embed.rendered.html;
      css = embed.rendered.css;
      jsonLd = embed.rendered.schema as Record<string, unknown>;
    } else {
      // Fallback to template-based renderer if rendered payload is missing
      const { renderFAQ } = await import("@/lib/renderer-v2");
      const { html: fallbackHtml, css: fallbackCss } = await renderFAQ(config);
      html = fallbackHtml;
      css = fallbackCss;
      jsonLd = {
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
    }

    // Generate integrity hash (simplified)
    const payload = JSON.stringify({ html, css, schema: jsonLd });
    const integrity = Buffer.from(payload).toString("base64").slice(0, 16);

    return NextResponse.json(
      {
        html,
        css,
        schema: jsonLd,
        integrity,
      },
      {
        headers: {
          ...corsHeaders,
          "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        },
      }
    );
  } catch (error) {
    console.error("Embed generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { 
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
