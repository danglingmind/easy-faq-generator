"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconHistory, IconLoader2 } from "@tabler/icons-react";
import { FAQConfig } from "@/lib/types";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

interface EmbedPreview {
  id: string;
  config: FAQConfig;
  createdAt: string;
  updatedAt: string;
  preview: {
    heading: string;
    template: string;
    itemCount: number;
  };
}

interface EmbedSelectorProps {
  onSelectEmbed: (config: FAQConfig) => void;
  isSignedIn: boolean;
}

export function EmbedSelector({ onSelectEmbed, isSignedIn }: EmbedSelectorProps) {
  const [open, setOpen] = useState(false);
  const [embeds, setEmbeds] = useState<EmbedPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEmbeds = async () => {
    if (!isSignedIn || !open) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/embeds");
      if (!response.ok) {
        throw new Error("Failed to load embeds");
      }
      const data = await response.json();
      setEmbeds(data.embeds || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load embeds");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && isSignedIn) {
      loadEmbeds();
    }
  }, [open, isSignedIn]);

  const handleSelect = async (embedId: string) => {
    try {
      const response = await fetch(`/api/embeds/${embedId}`);
      if (!response.ok) {
        throw new Error("Failed to load embed");
      }
      const data = await response.json();
      onSelectEmbed(data.embed.config);
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load embed");
    }
  };

  if (!isSignedIn) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <IconHistory className="mr-2 h-4 w-4" />
          Load Saved
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Load Saved Embed</DialogTitle>
          <DialogDescription>
            Select a previously saved embed configuration to edit
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <IconLoader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-sm text-destructive">{error}</div>
          ) : embeds.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No saved embeds found. Create your first embed to get started!
            </div>
          ) : (
            <div className="space-y-3">
              {embeds.map((embed) => (
                <Card
                  key={embed.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSelect(embed.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">
                          {embed.preview.heading || "Untitled FAQ"}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Template: {embed.preview.template} • {embed.preview.itemCount} items
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        Updated: {formatDate(embed.updatedAt)}
                      </span>
                      <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(embed.id);
                      }}>
                        Load
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
