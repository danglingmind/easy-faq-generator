import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createOrUpdateUserUsage, getUserUsage } from "@/lib/db/queries";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const usage = await getUserUsage(userId);

    return NextResponse.json({
      usage: usage || {
        embedCopied: false,
        embedCopyCount: 0,
      },
    });
  } catch (error) {
    console.error("Error fetching user usage:", error);
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
    const { embedCopied, embedCopyCount } = body;

    const existing = await getUserUsage(userId);
    const newCount = existing
      ? (existing.embedCopyCount || 0) + (embedCopyCount || 1)
      : embedCopyCount || 1;

    const usage = await createOrUpdateUserUsage(userId, {
      embedCopied: embedCopied !== undefined ? embedCopied : true,
      embedCopyCount: newCount,
    });

    return NextResponse.json({
      usage,
      success: true,
    });
  } catch (error) {
    console.error("Error updating user usage:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
