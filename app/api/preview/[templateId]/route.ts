import { NextRequest, NextResponse } from "next/server";
import { templates } from "@/lib/templates";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

/**
 * GET /api/preview/[templateId]
 * Serve static preview HTML file from templates directory
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const { templateId } = await params;
    
    // Check if template exists
    const templateMeta = templates.find((t) => t.id === templateId);
    if (!templateMeta) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Load preview.html from templates directory
    const previewPath = join(process.cwd(), "templates", templateId, "preview.html");
    
    if (!existsSync(previewPath)) {
      return NextResponse.json(
        { error: "Preview file not found. Please create preview.html in the template directory." },
        { status: 404 }
      );
    }

    const previewHTML = readFileSync(previewPath, "utf-8");

    return new NextResponse(previewHTML, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error loading preview:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
