import { NextResponse } from "next/server";
import { templates } from "@/lib/templates";
import { listTemplates } from "@/lib/r2";

/**
 * GET /api/templates
 * List all available templates
 */
export async function GET() {
  try {
    // Get templates from R2 (if available)
    const r2Templates = await listTemplates();
    
    // Merge with metadata from lib/templates.ts
    const templatesWithMetadata = templates.map((template) => ({
      ...template,
      available: r2Templates.includes(template.id) || template.id === "default",
    }));

    return NextResponse.json({
      templates: templatesWithMetadata,
    });
  } catch (error) {
    console.error("Error listing templates:", error);
    // Fallback to static templates if R2 fails
    return NextResponse.json({
      templates: templates.map((t) => ({ ...t, available: true })),
    });
  }
}
