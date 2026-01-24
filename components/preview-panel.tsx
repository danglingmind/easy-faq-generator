"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconDeviceDesktop, IconDeviceMobile } from "@tabler/icons-react";
import { FAQConfig } from "@/lib/types";
import { renderFAQSync } from "@/lib/renderer-v2";
import { generateDefaultTemplate } from "@/lib/template-fallback";

interface PreviewPanelProps {
  config: FAQConfig;
  previewMode: "desktop" | "mobile";
  onPreviewModeChange: (mode: "desktop" | "mobile") => void;
}

export function PreviewPanel({
  config,
  previewMode,
  onPreviewModeChange,
}: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [templateCache, setTemplateCache] = useState<{ html: string; css: string; js?: string } | null>(null);

  // Load template when template ID changes
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const response = await fetch(`/api/templates/${config.template}`);
        if (response.ok) {
          const template = await response.json();
          setTemplateCache(template);
        } else {
          // Use fallback
          setTemplateCache(generateDefaultTemplate());
        }
      } catch (error) {
        console.error("Error loading template:", error);
        setTemplateCache(generateDefaultTemplate());
      }
    };

    loadTemplate();
  }, [config.template]);

  useEffect(() => {
    if (!iframeRef.current || !templateCache) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Use template-based renderer
    const { html } = renderFAQSync(config, templateCache);

    doc.open();
    doc.write(html);
    doc.close();
  }, [config, templateCache]);

  return (
    <div className="flex flex-1 flex-col bg-muted/20">
      <div className="flex items-center justify-center border-b bg-background px-4 py-2">
        <div className="flex items-center gap-1 rounded-md border p-1">
          <Button
            variant={previewMode === "desktop" ? "default" : "ghost"}
            size="sm"
            onClick={() => onPreviewModeChange("desktop")}
            aria-label="Desktop view"
          >
            <IconDeviceDesktop className="h-4 w-4" />
          </Button>
          <Button
            variant={previewMode === "mobile" ? "default" : "ghost"}
            size="sm"
            onClick={() => onPreviewModeChange("mobile")}
            aria-label="Mobile view"
          >
            <IconDeviceMobile className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center overflow-hidden">
        <div
          className={`h-full w-full overflow-auto border-4 border-dashed border-muted ${
            previewMode === "mobile" ? "max-w-md mx-auto" : ""
          }`}
        >
          <iframe
            ref={iframeRef}
            className="h-full w-full border-0"
            title="FAQ Preview"
          />
        </div>
      </div>
    </div>
  );
}
