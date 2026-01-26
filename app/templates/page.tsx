"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { templates } from "@/lib/templates";
import { IconLock, IconCheck, IconEye } from "@tabler/icons-react";
import { isPaidFeaturesEnabled } from "@/lib/utils";
import { TemplatePreviewDialog } from "@/components/template-preview-dialog";

function TemplatesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();
  const isSignedIn = !!user?.id;
  const isPaid = isPaidFeaturesEnabled() || false; // TODO: Check from Stripe/webhook

  const selectedTemplateId = searchParams.get("template") || "default";
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    // Default template is always allowed
    if (templateId === "default") {
      router.push(`/editor?template=${templateId}`);
      return;
    }

    // Non-default templates require login
    if (!isSignedIn) {
      router.push(`/sign-in?redirect=/templates?template=${templateId}`);
      return;
    }

    // Premium templates require paid tier (unless bypassed)
    if (template.locked && !isPaid) {
      return;
    }

    router.push(`/editor?template=${templateId}`);
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Choose Your FAQ Template
          </h1>
          <p className="text-muted-foreground text-lg mb-4">
            Browse our collection of beautiful, SEO-optimized FAQ section templates. 
            Works seamlessly with Webflow, Showit, Squarespace, WordPress, and any website platform.
          </p>
          <p className="text-sm text-muted-foreground">
            Each template includes structured data for better SEO, responsive design, and easy customization. 
            Only the default template is available for free users.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => {
            const isSelected = selectedTemplateId === template.id;
            const isLocked = template.locked && !isPaid;
            const canSelect = template.id === "default" || isSignedIn;

            return (
              <Card
                key={template.id}
                className={`relative overflow-hidden transition-all cursor-pointer ${
                  isSelected
                    ? "ring-2 ring-primary border-primary"
                    : "hover:border-primary/50"
                } ${isLocked ? "opacity-60" : ""}`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className="relative w-full h-48 bg-muted overflow-hidden">
                  {template.thumbnail ? (
                    <Image
                      src={template.thumbnail}
                      alt={`${template.name} template preview`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={(e) => {
                        // Hide image if it fails to load
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                      <span className="text-muted-foreground text-sm">No preview</span>
                    </div>
                  )}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <IconLock className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">
                        {template.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                    {isSelected && (
                      <IconCheck className="h-5 w-5 text-primary flex-shrink-0 ml-2" />
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    {template.id === "default" ? (
                      <span className="text-xs text-muted-foreground">Free</span>
                    ) : isLocked ? (
                      <span className="text-xs text-muted-foreground">
                        {isSignedIn ? "Upgrade required" : "Sign in required"}
                      </span>
                    ) : (
                      <span className="text-xs text-primary">Available</span>
                    )}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplateId(template.id);
                        }}
                        title="View Preview"
                      >
                        <IconEye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={isSelected ? "default" : "outline"}
                        disabled={isLocked}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTemplateSelect(template.id);
                        }}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => router.push("/editor")}>
            Back to Editor
          </Button>
        </div>
      </div>
      
      {previewTemplateId && (
        <TemplatePreviewDialog
          templateId={previewTemplateId}
          templateName={templates.find((t) => t.id === previewTemplateId)?.name || "Template"}
          open={!!previewTemplateId}
          onOpenChange={(open) => {
            if (!open) setPreviewTemplateId(null);
          }}
        />
      )}
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <TemplatesPageContent />
    </Suspense>
  );
}
