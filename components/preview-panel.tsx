"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { IconDeviceDesktop, IconDeviceMobile, IconCopy, IconCheck } from "@tabler/icons-react";
import { FAQConfig } from "@/lib/types";
import { renderFAQSync } from "@/lib/renderer-v2";
import { generateDefaultTemplate } from "@/lib/template-fallback";
import { toast } from "sonner";

interface PreviewPanelProps {
  config: FAQConfig;
  previewMode: "desktop" | "mobile";
  onPreviewModeChange: (mode: "desktop" | "mobile") => void;
  currentEmbedId?: string | null;
}

export function PreviewPanel({
  config,
  previewMode,
  onPreviewModeChange,
  currentEmbedId,
}: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [templateCache, setTemplateCache] = useState<{ html: string; css: string; js?: string } | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");

  // Generate complete HTML code (the same HTML that gets injected by the embed script)
  const completeHTMLCode = useMemo(() => {
    if (!templateCache) return "Loading...";
    
    // Use the same renderer as the preview to get the complete HTML
    const { html } = renderFAQSync(config, templateCache);
    
    // Format HTML for better readability
    return formatHTML(html);
  }, [config, templateCache]);

  // Copy code to clipboard
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(completeHTMLCode);
      setCodeCopied(true);
      toast.success("Complete HTML code copied to clipboard!");
      setTimeout(() => setCodeCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
      toast.error("Failed to copy code. Please try again.");
    }
  };

  // Simple HTML formatter for better readability
  function formatHTML(html: string): string {
    // Handle script and style tags specially - preserve their content
    const scriptStyleRegex = /<(script|style)([^>]*)>([\s\S]*?)<\/\1>/gi;
    const placeholders: string[] = [];
    let placeholderIndex = 0;
    
    // Replace script/style tags with placeholders
    html = html.replace(scriptStyleRegex, (match, tag, attrs, content) => {
      const placeholder = `__PLACEHOLDER_${placeholderIndex}__`;
      placeholders[placeholderIndex] = `<${tag}${attrs}>\n${content.trim()}\n</${tag}>`;
      placeholderIndex++;
      return placeholder;
    });
    
    let formatted = "";
    let indent = 0;
    const tab = "  "; // 2 spaces
    
    // Remove existing whitespace between tags (but preserve in placeholders)
    html = html.replace(/>\s+</g, "><");
    
    // Split by tags
    const parts = html.split(/(<[^>]+>|__PLACEHOLDER_\d+__)/);
    
    for (const part of parts) {
      if (!part.trim()) continue;
      
      // Check if it's a placeholder
      const placeholderMatch = part.match(/^__PLACEHOLDER_(\d+)__$/);
      if (placeholderMatch) {
        const placeholderContent = placeholders[parseInt(placeholderMatch[1])];
        // Format the placeholder content (script/style tag)
        const lines = placeholderContent.split("\n");
        for (let i = 0; i < lines.length; i++) {
          if (i === 0) {
            // Opening tag
            formatted += tab.repeat(indent) + lines[i] + "\n";
            indent++;
          } else if (i === lines.length - 1) {
            // Closing tag
            indent--;
            formatted += tab.repeat(indent) + lines[i] + "\n";
          } else {
            // Content
            formatted += tab.repeat(indent) + lines[i] + "\n";
          }
        }
        continue;
      }
      
      if (part.startsWith("</")) {
        // Closing tag - decrease indent before adding
        indent = Math.max(0, indent - 1);
        formatted += tab.repeat(indent) + part + "\n";
      } else if (part.startsWith("<")) {
        // Opening tag
        formatted += tab.repeat(indent) + part + "\n";
        // Check if it's a self-closing tag
        if (!part.includes("/>") && !part.match(/<(meta|link|br|hr|img|input)/i)) {
          indent++;
        }
      } else {
        // Text content
        const trimmed = part.trim();
        if (trimmed) {
          formatted += tab.repeat(indent) + trimmed + "\n";
        }
      }
    }
    
    return formatted.trim();
  }

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
    <div className="flex flex-1 flex-col bg-muted/20 min-h-0">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col min-h-0">
        <div className="flex items-center justify-between border-b bg-background px-4 py-2 shrink-0">
          <TabsList>
            <TabsTrigger value="preview">Live Preview</TabsTrigger>
            <TabsTrigger value="code">Code View</TabsTrigger>
          </TabsList>
          {activeTab === "preview" && (
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
          )}
          {activeTab === "code" && (
            <Button
              variant="default"
              size="sm"
              onClick={handleCopyCode}
              aria-label="Copy code"
            >
              {codeCopied ? (
                <>
                  <IconCheck className="h-4 w-4" />
                  <span className="ml-1">Copied!</span>
                </>
              ) : (
                <>
                  <IconCopy className="h-4 w-4" />
                  <span className="ml-1">Copy Code</span>
                </>
              )}
            </Button>
          )}
        </div>
        <TabsContent value="preview" className="flex flex-1 m-0 mt-0 overflow-hidden min-h-0 data-[state=active]:flex data-[state=inactive]:hidden">
          <div className="flex flex-1 items-center justify-center overflow-hidden min-h-0 w-full">
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
        </TabsContent>
        <TabsContent value="code" className="flex flex-1 m-0 mt-0 overflow-hidden min-h-0 data-[state=active]:flex data-[state=inactive]:hidden">
          <div className="h-full w-full overflow-auto bg-background p-4 min-h-0">
            <div className="relative h-full min-h-0">
              <pre className="h-full overflow-auto rounded-md border bg-muted p-4 text-sm font-mono min-h-0">
                <code className="text-foreground whitespace-pre">{completeHTMLCode}</code>
              </pre>
              {!currentEmbedId && (
                <div className="absolute top-4 right-4 rounded-md bg-blue-100 dark:bg-blue-900/20 px-3 py-2 text-xs text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-800 max-w-xs z-10">
                  <strong>Note:</strong> This is the complete HTML that will be injected by the embed script. Save your embed to get a real embed ID.
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
