import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getEmbedById } from "@/lib/db/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const embed = await getEmbedById(id);

    if (!embed) {
      return NextResponse.json(
        { error: "Embed not found" },
        { status: 404 }
      );
    }

    // Verify the embed belongs to the user
    if (embed.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      embed: {
        id: embed.id,
        config: embed.config,
        rendered: embed.rendered,
        createdAt: embed.createdAt,
        updatedAt: embed.updatedAt,
      },
      success: true,
    });
  } catch (error) {
    console.error("Error fetching embed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
