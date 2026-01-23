"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { templates } from "@/lib/templates";
import { IconLock, IconCheck } from "@tabler/icons-react";
import { isPaidFeaturesEnabled } from "@/lib/utils";

export default function TemplatesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoaded } = useUser();
  const isSignedIn = !!user?.id;
  const isPaid = isPaidFeaturesEnabled() || false; // TODO: Check from Stripe/webhook

  const selectedTemplateId = searchParams.get("template") || "default";

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    // Default template is always allowed
    if (templateId === "default") {
      router.push(`/?template=${templateId}`);
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

    router.push(`/?template=${templateId}`);
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
          <h1 className="text-3xl font-bold mb-2">Browse Templates</h1>
          <p className="text-muted-foreground">
            Choose a template to get started. Only the default template is available for free users.
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
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        {template.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                    {isSelected && (
                      <IconCheck className="h-5 w-5 text-primary flex-shrink-0" />
                    )}
                    {isLocked && (
                      <IconLock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
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
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Editor
          </Button>
        </div>
      </div>
    </div>
  );
}
