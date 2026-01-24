import { FAQConfig } from "./types";
import { getTemplate } from "./r2";
import { buildEmbedPayload } from "./embed-payload";
import { generateDefaultTemplate } from "./template-fallback";

/**
 * Render FAQ using template system
 * This is the new template-based renderer
 */
export async function renderFAQ(config: FAQConfig): Promise<{ html: string; css: string }> {
  const { template: templateId } = config;

  // Load template from R2 or use fallback
  let template = await getTemplate(templateId);
  
  if (!template) {
    // Use fallback for default template
    if (templateId === "default") {
      template = generateDefaultTemplate();
    } else {
      // For other templates, fall back to default
      template = generateDefaultTemplate();
      console.warn(`Template ${templateId} not found, using default`);
    }
  }

  const { html, css } = buildEmbedPayload(config, template);

  return { html, css };
}

/**
 * Render FAQ synchronously (for client-side preview)
 * Uses cached templates or fallback
 */
export function renderFAQSync(
  config: FAQConfig,
  templateCache?: { html: string; css: string; js?: string }
): { html: string; css: string } {
  const { template: templateId } = config;

  // Use cached template or fallback
  const template = templateCache || generateDefaultTemplate();

  const { html, css } = buildEmbedPayload(config, template);

  return { html, css };
}
