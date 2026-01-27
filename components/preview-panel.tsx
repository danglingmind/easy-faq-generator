"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { IconDeviceDesktop, IconDeviceMobile, IconCopy, IconCheck } from "@tabler/icons-react";
import { FAQConfig } from "@/lib/types";
import { renderFAQSync } from "@/lib/renderer-v2";
import { generateDefaultTemplate } from "@/lib/template-fallback";
import { isCodePreviewEnabled } from "@/lib/utils";
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
  const [iframeKey, setIframeKey] = useState(0);
  
  // Check if code preview feature is enabled
  const codePreviewEnabled = isCodePreviewEnabled();

  // Reset to preview tab if code preview is disabled and user is on code tab
  useEffect(() => {
    if (!codePreviewEnabled && activeTab === "code") {
      setActiveTab("preview");
    }
  }, [codePreviewEnabled, activeTab]);

  // Generate complete HTML code (the same HTML that gets injected by the embed script)
  const completeHTMLCode = useMemo(() => {
    if (!templateCache) return "Loading...";
    
    // Use the same renderer as the preview to get the complete HTML
    const { html } = renderFAQSync(config, templateCache);
    
    // Format HTML for better readability
    return formatHTML(html);
  }, [config, templateCache]);

  // Generate HTML for iframe srcdoc
  const iframeHTML = useMemo(() => {
    if (!templateCache) return "";
    const { html } = renderFAQSync(config, templateCache);
    return html;
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

  // Force iframe reload when switching to preview tab or when config changes
  useEffect(() => {
    if (activeTab === "preview" && templateCache) {
      // Increment key to force iframe remount/reload
      setIframeKey(prev => prev + 1);
    }
  }, [activeTab, config, templateCache]);

  return (
    <div className="flex flex-1 flex-col bg-muted/20 min-h-0">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col min-h-0">
        <div className="flex items-center justify-between border-b bg-background px-4 py-2 shrink-0">
          <TabsList>
            <TabsTrigger value="preview">Live Preview</TabsTrigger>
            {codePreviewEnabled && (
              <TabsTrigger value="code">Code View</TabsTrigger>
            )}
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
          {codePreviewEnabled && activeTab === "code" && (
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
                key={iframeKey}
                ref={iframeRef}
                className="h-full w-full border-0"
                title="FAQ Preview"
                srcDoc={iframeHTML || undefined}
                onLoad={() => {
                  // Execute scripts and initialize accordion after iframe loads
                  if (activeTab === "preview" && iframeRef.current && templateCache) {
                    const iframe = iframeRef.current;
                    const doc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (!doc) return;

                    const executeScripts = () => {
                      try {
                        // Execute inline scripts
                        const scripts = Array.from(doc.querySelectorAll('script'));
                        scripts.forEach((oldScript) => {
                          const scriptType = (oldScript.type || '').toLowerCase();
                          if (scriptType === 'application/ld+json' || scriptType === 'application/json' || scriptType.startsWith('application/')) {
                            return;
                          }
                          const content = oldScript.textContent || '';
                          if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
                            return;
                          }
                          if (oldScript.src) {
                            const newScript = doc.createElement('script');
                            newScript.src = oldScript.src;
                            newScript.async = oldScript.async;
                            newScript.defer = oldScript.defer;
                            doc.head.appendChild(newScript);
                            oldScript.remove();
                          } else if (content.trim()) {
                            const newScript = doc.createElement('script');
                            newScript.textContent = content;
                            oldScript.remove();
                            doc.body.appendChild(newScript);
                            setTimeout(() => {
                              if (newScript.parentNode) {
                                newScript.parentNode.removeChild(newScript);
                              }
                            }, 0);
                          }
                        });

                        // Initialize accordion manually as fallback
                        setTimeout(() => {
                          const containers = doc.querySelectorAll('.faq-container');
                          if (containers.length > 0) {
                            containers.forEach((container) => {
                              const items = container.querySelectorAll('.faq-item');
                              const animationType = container.getAttribute('data-animation-type') || 'Fade';
                              const animationDuration = parseInt(container.getAttribute('data-animation-duration') || '300', 10);
                              const mode = container.getAttribute('data-accordion-mode') || 'single';

                              items.forEach((item) => {
                                const button = item.querySelector('[data-accordion-button]') as HTMLElement;
                                const answer = item.querySelector('.faq-answer') as HTMLElement;
                                
                                if (!button || !answer) return;

                                const dataOpen = item.getAttribute('data-open');
                                if (dataOpen !== 'true') {
                                  if (animationType === 'Fade') {
                                    answer.style.transition = `opacity ${animationDuration}ms`;
                                    answer.style.opacity = '0';
                                    answer.hidden = true;
                                  } else if (animationType === 'Slide') {
                                    answer.style.transition = `max-height ${animationDuration}ms`;
                                    answer.style.overflow = 'hidden';
                                    answer.style.maxHeight = '0px';
                                    answer.hidden = true;
                                  } else {
                                    answer.hidden = true;
                                  }
                                  button.setAttribute('aria-expanded', 'false');
                                  item.setAttribute('data-open', 'false');
                                }

                                const newButton = button.cloneNode(true);
                                button.parentNode?.replaceChild(newButton, button);
                                
                                newButton.addEventListener('click', function(e) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  
                                  const currentlyOpen = item.getAttribute('data-open') === 'true';
                                  const nextOpen = !currentlyOpen;
                                  
                                  if (mode === 'single' && nextOpen) {
                                    items.forEach((other) => {
                                      if (other !== item) {
                                        const otherAnswer = other.querySelector('.faq-answer') as HTMLElement;
                                        const otherButton = other.querySelector('[data-accordion-button]') as HTMLElement;
                                        if (otherAnswer && otherButton) {
                                          if (animationType === 'Fade') {
                                            otherAnswer.style.opacity = '0';
                                          } else if (animationType === 'Slide') {
                                            otherAnswer.style.maxHeight = '0px';
                                          }
                                          otherAnswer.hidden = true;
                                          otherButton.setAttribute('aria-expanded', 'false');
                                          other.setAttribute('data-open', 'false');
                                        }
                                      }
                                    });
                                  }
                                  
                                  item.setAttribute('data-open', nextOpen ? 'true' : 'false');
                                  (newButton as HTMLElement).setAttribute('aria-expanded', String(nextOpen));
                                  
                                  if (animationType === 'Slide') {
                                    answer.hidden = false;
                                    answer.style.overflow = 'hidden';
                                    answer.style.transition = `max-height ${animationDuration}ms`;
                                    if (nextOpen) {
                                      answer.style.maxHeight = answer.scrollHeight + 'px';
                                    } else {
                                      answer.style.maxHeight = '0px';
                                      setTimeout(() => {
                                        answer.hidden = true;
                                      }, animationDuration);
                                    }
                                  } else if (animationType === 'Fade') {
                                    answer.style.transition = `opacity ${animationDuration}ms`;
                                    answer.style.opacity = nextOpen ? '1' : '0';
                                    answer.hidden = !nextOpen;
                                  } else {
                                    answer.hidden = !nextOpen;
                                  }
                                });
                              });
                            });
                          }
                        }, 100);
                      } catch (error) {
                        console.error('[Preview] Error in onLoad:', error);
                      }
                    };

                    // Execute scripts with multiple attempts
                    executeScripts();
                    setTimeout(executeScripts, 50);
                    setTimeout(executeScripts, 200);
                  }
                }}
              />
            </div>
          </div>
        </TabsContent>
        {codePreviewEnabled && (
          <TabsContent
            value="code"
            className="flex flex-1 flex-col m-0 mt-0 overflow-hidden min-h-0 data-[state=active]:flex data-[state=inactive]:hidden"
            // Avoid horizontal growth beyond parent!
            style={{ minHeight: 0, height: "100%" }}
          >
            <div className="flex-1 flex flex-col h-0 min-h-0 overflow-hidden bg-background p-4">
              <div className="relative flex-1 min-h-0 h-0">
                <pre className="absolute inset-0 overflow-auto rounded-md border bg-muted p-4 text-sm font-mono min-h-0 m-0"
                  style={{ maxHeight: "100%", minHeight: 0, height: "100%" }}
                >
                  <code className="text-foreground whitespace-pre">{completeHTMLCode}</code>
                </pre>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
