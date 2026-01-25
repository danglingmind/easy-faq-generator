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
            <SelectContent>
              {templates.map((template) => (
                <SelectItem
                  key={template.id}
                  value={template.id}
                  disabled={
                    (template.id !== "default" && !isSignedIn) ||
                    (template.locked && !isPaid)
                  }
                  className="py-3"
                >
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="font-medium text-sm">{template.name}</span>
                    <span className="text-xs text-muted-foreground leading-tight">
                      {template.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
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
