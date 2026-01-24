import { FAQConfig, FAQContent } from "./types";
import { TemplateFile } from "./r2";
import { buildCombinedCSS, injectContent } from "./template-loader";

export interface EmbedPayload {
  html: string;
  css: string;
  schema: Record<string, unknown>;
}

export function buildEmbedPayload(
  config: FAQConfig,
  template: TemplateFile
): EmbedPayload {
  const { content, styles, template: templateId } = config;
  const html = injectContent(template, content, styles, templateId);
  const css = buildCombinedCSS(template, styles, templateId);
  const schema = buildSchema(content);

  return { html, css, schema };
}

function buildSchema(content: FAQContent): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.items.map((item) => ({
      "@type": "Question",
      name: item.question || "",
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer || "",
      },
    })),
  };
}
