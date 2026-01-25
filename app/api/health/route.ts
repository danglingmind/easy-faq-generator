import { NextResponse } from "next/server";

/**
 * Health check endpoint for Fly.io
 * This endpoint is lightweight and doesn't require database or external services
 * to respond quickly for health checks
 */
export async function GET() {
  return NextResponse.json(
    { status: "ok", timestamp: new Date().toISOString() },
    { status: 200 }
  );
}
