import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createEmbed } from "@/lib/db/queries";
import { FAQConfig } from "@/lib/types";

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

    if (!config) {
      return NextResponse.json(
        { error: "Config is required" },
        { status: 400 }
      );
    }

    const embed = await createEmbed(userId, config);

    return NextResponse.json({
      embedId: embed.id,
      success: true,
    });
  } catch (error) {
    console.error("Error creating embed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
