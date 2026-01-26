"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FAQStyles } from "@/lib/types";
import { templates } from "@/lib/templates";
import { IconCopy, IconLock, IconTemplate } from "@tabler/icons-react";
import { TypographyControls } from "./typography-controls";
import { ColorControls } from "./color-controls";
import { AccordionControls } from "./accordion-controls";
import { SpacingControls } from "./spacing-controls";
import { EmbedSelector } from "./embed-selector";
import { FAQConfig } from "@/lib/types";

interface InspectorPanelProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
  styles: FAQStyles;
  onStylesChange: (styles: FAQStyles) => void;
  isPaid: boolean;
  isSignedIn: boolean;
  embedCopied: boolean;
  onCopyEmbed: () => void;
  onLoadEmbed?: (config: FAQConfig, embedId: string) => void;
}

export function InspectorPanel({
  selectedTemplate,
  onTemplateChange,
  styles,
  onStylesChange,
  isPaid,
  isSignedIn,
  embedCopied,
  onCopyEmbed,
  onLoadEmbed,
}: InspectorPanelProps) {
  const router = useRouter();

  return (
    <div className="w-[340px] overflow-y-auto border-l bg-muted/30 p-4">
      <div className="space-y-6">
        {isSignedIn && onLoadEmbed && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label>Saved Embeds</Label>
            </div>
            <EmbedSelector onSelectEmbed={onLoadEmbed} isSignedIn={isSignedIn} />
          </div>
        )}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label>Template</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/templates")}
            >
              <IconTemplate className="mr-2 h-4 w-4" />
              Browse Templates
            </Button>
          </div>
          <Select value={selectedTemplate} onValueChange={(value: string | null) => {
            if (value) {
              onTemplateChange(value);
            }
          }}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="min-w-[var(--radix-select-trigger-width)] w-[var(--radix-select-trigger-width)] max-w-[340px] [&_[data-slot=select-item-text]]:!whitespace-normal [&_[data-slot=select-item-text]]:!flex [&_[data-slot=select-item-text]]:!flex-col [&_[data-slot=select-item-text]]:!items-start [&_[data-slot=select-item-text]]:!w-full">
              {templates.map((template) => {
                const requiresSignIn = template.id !== "default" && !isSignedIn;
                const showLock = template.locked && !isPaid;
                // Only disable if requires sign-in (we'll handle locked templates with toast)
                const isDisabled = requiresSignIn;
                
                return (
                  <SelectItem
                    key={template.id}
                    value={template.id}
                    disabled={isDisabled}
                    className="py-3.5 px-3 pr-8 min-h-[76px]"
                  >
                    <div className="flex w-full items-start gap-2 pr-2">
                      <div className="flex flex-col items-start gap-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 w-full">
                          <span className="font-medium text-sm leading-tight">{template.name}</span>
                          {showLock && (
                            <IconLock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground leading-relaxed break-words w-full">
                          {template.description}
                        </span>
                        {showLock && (
                          <span className="text-xs text-amber-600 dark:text-amber-500 leading-tight mt-0.5">
                            Premium template - Upgrade to unlock
                          </span>
                        )}
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {isPaid && isSignedIn ? (
          <>
            <TypographyControls
              styles={styles}
              onStylesChange={onStylesChange}
            />
            <ColorControls styles={styles} onStylesChange={onStylesChange} />
            <AccordionControls
              styles={styles}
              onStylesChange={onStylesChange}
            />
            <SpacingControls styles={styles} onStylesChange={onStylesChange} />
          </>
        ) : isSignedIn ? (
          <div className="space-y-4 rounded-lg border border-dashed p-4 text-center">
            <IconLock className="mx-auto h-8 w-8 text-muted-foreground" />
            <div className="text-sm font-medium">Styling Locked</div>
            <div className="text-xs text-muted-foreground">
              Upgrade to unlock full customization
            </div>
            <Button variant="default" size="sm" className="w-full">
              Upgrade Now
            </Button>
          </div>
        ) : (
          <div className="space-y-4 rounded-lg border border-dashed p-4 text-center">
            <IconLock className="mx-auto h-8 w-8 text-muted-foreground" />
            <div className="text-sm font-medium">Sign in required</div>
            <div className="text-xs text-muted-foreground">
              Sign in to copy embed code, change templates, or customize styling
            </div>
            <Button variant="default" size="sm" className="w-full" onClick={onCopyEmbed}>
              Sign in to continue
            </Button>
          </div>
        )}

        <div className="sticky bottom-0 border-t bg-background pt-4">
          <Button
            variant="default"
            size="lg"
            className="w-full"
            onClick={onCopyEmbed}
            disabled={!isSignedIn || (embedCopied && !isPaid)}
          >
            <IconCopy className="mr-2 h-4 w-4" />
            {!isSignedIn
              ? "Sign in to Copy Embed Code"
              : embedCopied && !isPaid
                ? "Embed Code Copied"
                : "Copy Embed Code"}
          </Button>
          {embedCopied && !isPaid && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Upgrade for unlimited copies
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
