import { NextRequest, NextResponse } from "next/server";
import { getTemplate } from "@/lib/r2";
import { templates } from "@/lib/templates";
import { generateDefaultTemplate } from "@/lib/template-fallback";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

/**
 * Load template from local filesystem (for development)
 */
function loadLocalTemplate(templateId: string) {
  try {
    const templatesDir = join(process.cwd(), "templates", templateId);
    const htmlPath = join(templatesDir, "template.html");
    const cssPath = join(templatesDir, "template.css");
    const jsPath = join(templatesDir, "template.js");

    if (!existsSync(htmlPath) || !existsSync(cssPath)) {
      return null;
    }

    const html = readFileSync(htmlPath, "utf-8");
    const css = readFileSync(cssPath, "utf-8");
    const js = existsSync(jsPath) ? readFileSync(jsPath, "utf-8") : undefined;

    return { html, css, js };
  } catch (error) {
    console.error(`Error loading local template ${templateId}:`, error);
    return null;
  }
}

/**
 * GET /api/templates/[id]
 * Get template HTML, CSS, and JS files
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if template exists in metadata
    const templateMeta = templates.find((t) => t.id === id);
    if (!templateMeta) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // In development, try local files first (faster iteration)
    const isDevelopment = process.env.NODE_ENV === "development";
    let template = null;

    if (isDevelopment) {
      template = loadLocalTemplate(id);
    }

    // If not found locally (or in production), try R2
    if (!template) {
      template = await getTemplate(id);
    }

    // If still not found, use fallback generator for default template
    if (!template) {
      if (id === "default") {
        const fallback = generateDefaultTemplate();
        return NextResponse.json(fallback);
      }
      
      return NextResponse.json(
        { error: "Template files not found in storage" },
        { status: 404 }
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
