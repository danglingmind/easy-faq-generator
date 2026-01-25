"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { TopBar } from "./top-bar";
import { ContentPanel } from "./content-panel";
import { PreviewPanel } from "./preview-panel";
import { InspectorPanel } from "./inspector-panel";
import { FAQConfig, FAQContent, FAQStyles } from "@/lib/types";
import { defaultStyles, templates } from "@/lib/templates";
import { isPaidFeaturesEnabled, saveEditorState, loadEditorState } from "@/lib/utils";
import { extractTemplateStyles } from "@/lib/template-style-extractor";
import { buildEmbedPayload } from "@/lib/embed-payload";

export function EditorPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Load state from localStorage or initialize
  const savedState = loadEditorState();
  const [content, setContent] = useState<FAQContent>(
    savedState?.content || {
      heading: "Frequently Asked Questions",
      description: "Find answers to common questions about our product.",
      items: [
        { id: "1", question: "What is this?", answer: "This is a FAQ generator." },
      ],
    }
  );
  const [selectedTemplate, setSelectedTemplate] = useState(
    searchParams.get("template") || savedState?.selectedTemplate || "default"
  );
  // Normalize styles to ensure all new properties exist
  const normalizeStyles = (savedStyles: any): FAQStyles => {
    if (!savedStyles) return defaultStyles;
    
    return {
      ...defaultStyles,
      ...savedStyles,
      accordion: {
        ...defaultStyles.accordion,
        ...savedStyles.accordion,
        borderStyle: savedStyles.accordion?.borderStyle || defaultStyles.accordion.borderStyle,
        borderVisible: savedStyles.accordion?.borderVisible !== undefined 
          ? savedStyles.accordion.borderVisible 
          : defaultStyles.accordion.borderVisible,
        borderSides: savedStyles.accordion?.borderSides || defaultStyles.accordion.borderSides,
      },
    };
  };

  const [styles, setStyles] = useState<FAQStyles>(
    normalizeStyles(savedState?.styles)
  );
  const [embedCopied, setEmbedCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [isPaid, setIsPaid] = useState(false);
  const [currentEmbedId, setCurrentEmbedId] = useState<string | null>(null);

  const isSignedIn = !!user?.id;

  const embedCopyStorageKey = useMemo(() => {
    if (!user?.id) return null;
    return `faq-embed:copy-used:${user.id}`;
  }, [user?.id]);

  // Load user subscription status and usage
  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      setIsPaid(isPaidFeaturesEnabled());
      return;
    }

    const loadUserData = async () => {
      try {
        // Check subscription
        const subResponse = await fetch("/api/user/subscription");
        if (subResponse.ok) {
          const { isPaid } = await subResponse.json();
          setIsPaid(isPaid || isPaidFeaturesEnabled());
        }

        // Check usage
        const usageResponse = await fetch("/api/user/usage");
        if (usageResponse.ok) {
          const { usage } = await usageResponse.json();
          if (usage) {
            setEmbedCopied(usage.embedCopied || false);
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setIsPaid(isPaidFeaturesEnabled());
      }
    };

    loadUserData();
  }, [isLoaded, isSignedIn]);

  // Handle payment success/cancel redirects
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    if (paymentStatus === "success") {
      toast.success("Payment successful! Your account has been upgraded.");
      // Refresh subscription status
      if (isSignedIn) {
        fetch("/api/user/subscription")
          .then((res) => res.json())
          .then((data) => {
            setIsPaid(data.isPaid || isPaidFeaturesEnabled());
          })
          .catch(console.error);
      }
      // Clean up URL
      router.replace("/editor");
    } else if (paymentStatus === "cancelled") {
      toast.info("Payment was cancelled.");
      // Clean up URL
      router.replace("/editor");
    }
  }, [searchParams, isSignedIn, router]);

  const handleContentChange = useCallback((newContent: FAQContent) => {
    setContent(newContent);
  }, []);

  // Handle template from URL
  useEffect(() => {
    const templateParam = searchParams.get("template");
    if (templateParam) {
      const template = templates.find((t) => t.id === templateParam);
      if (template && (template.id === "default" || isSignedIn)) {
        if (!template.locked || isPaid) {
          setSelectedTemplate(templateParam);
          
          // Load template styles
          if (templateParam !== "default") {
            extractTemplateStyles(templateParam).then((templateStyles) => {
              if (templateStyles) {
                setStyles(templateStyles);
              }
            }).catch(console.error);
          } else {
            setStyles(defaultStyles);
          }
        }
      }
    }
  }, [searchParams, isSignedIn, isPaid]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveEditorState({
      content,
      selectedTemplate,
      styles,
    });
  }, [content, selectedTemplate, styles]);

  const handleStylesChange = useCallback((newStyles: FAQStyles) => {
    setStyles(newStyles);
  }, []);

  const handleTemplateChange = useCallback(async (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    // Default template is always allowed.
    if (templateId === "default") {
      setSelectedTemplate("default");
      // Reset to default styles
      setStyles(defaultStyles);
      return;
    }

    // Any non-default template requires login.
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    // Premium templates still require paid tier.
    if (template.locked && !isPaid) return;

    setSelectedTemplate(templateId);
    
    // Load template styles and populate editor
    try {
      const templateStyles = await extractTemplateStyles(templateId);
      if (templateStyles) {
        setStyles(templateStyles);
      } else {
        // Fallback to default if extraction fails
        setStyles(defaultStyles);
      }
    } catch (error) {
      console.error("Error loading template styles:", error);
      setStyles(defaultStyles);
    }
  }, [isPaid, isSignedIn, router]);

  // Create config using useMemo so it's available for callbacks
  const config: FAQConfig = useMemo(
    () => ({
      content,
      template: selectedTemplate,
      styles,
    }),
    [content, selectedTemplate, styles]
  );

  const handleLoadEmbed = useCallback((loadedConfig: FAQConfig, embedId: string) => {
    // Update content
    setContent(loadedConfig.content);
    
    // Update template
    setSelectedTemplate(loadedConfig.template);
    
    // Update styles
    setStyles(normalizeStyles(loadedConfig.styles));
    
    // Track the loaded embed ID
    setCurrentEmbedId(embedId);
    
    // Save to localStorage
    saveEditorState({
      content: loadedConfig.content,
      selectedTemplate: loadedConfig.template,
      styles: loadedConfig.styles,
    });
    
    toast.success("Embed configuration loaded!");
  }, []);

  const handleCopyEmbed = useCallback(async () => {
    // Copy embed always requires login.
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (embedCopied && !isPaid) return;

    try {
      let renderedPayload = null;
      try {
        const templateResponse = await fetch(`/api/templates/${config.template}`);
        if (templateResponse.ok) {
          const template = await templateResponse.json();
          renderedPayload = buildEmbedPayload(config, template);
        }
      } catch (error) {
        console.warn("Failed to build rendered payload:", error);
      }

      // Save embed to database
      const response = await fetch("/api/embeds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          config, 
          rendered: renderedPayload,
          embedId: currentEmbedId, // Pass the current embed ID if we're updating an existing one
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save embed");
      }

      const { embedId, reused } = await response.json();
      // Always use NEXT_PUBLIC_APP_URL for embed script source to ensure it points to the correct domain
      // This is critical because window.location.origin would be wrong if accessed from a different domain
      const appOrigin = process.env.NEXT_PUBLIC_APP_URL || 'https://easy-faq-generator.fly.dev';
      // Include data-faq-origin so the embed script knows where to fetch from, even when embedded on other domains
      const embedCode = `<div data-faq-embed="${embedId}" data-faq-origin="${appOrigin}"></div>\n<script src="${appOrigin}/faq-embed.js" async></script>`;

      // Update the current embed ID if we got a new one
      setCurrentEmbedId(embedId);

      await navigator.clipboard.writeText(embedCode);
      setEmbedCopied(true);
      toast.success(reused ? "Embed updated and code copied!" : "Embed code copied to clipboard!");

      // Update user usage in database
      try {
        await fetch("/api/user/usage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            embedCopied: true,
          }),
        });
      } catch (error) {
        console.error("Failed to update usage:", error);
        // Don't block the copy operation if usage update fails
      }

      if (!isPaid && embedCopyStorageKey) {
        try {
          localStorage.setItem(embedCopyStorageKey, "true");
        } catch {
          // ignore
        }
      }
    } catch (error) {
      console.error("Failed to copy embed code:", error);
      toast.error("Failed to copy embed code. Please try again.");
    }
  }, [embedCopied, embedCopyStorageKey, isPaid, isSignedIn, router, config, currentEmbedId]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <TopBar
        user={user}
        isSignedIn={isSignedIn}
        isPaid={isPaid}
      />
      <div className="flex flex-1 overflow-hidden">
        <ContentPanel
          content={content}
          onChange={handleContentChange}
          isPaid={isPaid}
        />
        <PreviewPanel
          config={config}
          previewMode={previewMode}
          onPreviewModeChange={setPreviewMode}
          currentEmbedId={currentEmbedId}
        />
        <InspectorPanel
          selectedTemplate={selectedTemplate}
          onTemplateChange={handleTemplateChange}
          styles={styles}
          onStylesChange={handleStylesChange}
          isPaid={isPaid}
          isSignedIn={isSignedIn}
          embedCopied={embedCopied}
          onCopyEmbed={handleCopyEmbed}
          onLoadEmbed={handleLoadEmbed}
        />
      </div>
    </div>
  );
}
