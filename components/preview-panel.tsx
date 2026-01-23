"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { IconDeviceDesktop, IconDeviceMobile } from "@tabler/icons-react";
import { FAQConfig } from "@/lib/types";
import { renderFAQ } from "@/lib/renderer";

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

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    const { html, css } = renderFAQ(config);

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>${css}</style>
        </head>
        <body style="margin: 0; padding: 0;">
          ${html}
        </body>
      </html>
    `);
    doc.close();
  }, [config]);

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
