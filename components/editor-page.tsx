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

  const handleTemplateChange = useCallback((templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    // Default template is always allowed.
    if (templateId === "default") {
      setSelectedTemplate("default");
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

  const handleCopyEmbed = useCallback(async () => {
    // Copy embed always requires login.
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (embedCopied && !isPaid) return;

    try {
      // Save embed to database
      const response = await fetch("/api/embeds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ config }),
      });

      if (!response.ok) {
        throw new Error("Failed to save embed");
      }

      const { embedId } = await response.json();
      const embedCode = `<div data-faq-embed="${embedId}"></div>\n<script src="${window.location.origin}/faq-embed.js" async></script>`;

      await navigator.clipboard.writeText(embedCode);
      setEmbedCopied(true);
      toast.success("Embed code copied to clipboard!");

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
  }, [embedCopied, embedCopyStorageKey, isPaid, isSignedIn, router, config]);

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
        />
      </div>
    </div>
  );
}
