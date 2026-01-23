"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FAQStyles } from "@/lib/types";

interface ColorControlsProps {
  styles: FAQStyles;
  onStylesChange: (styles: FAQStyles) => void;
}

export function ColorControls({ styles, onStylesChange }: ColorControlsProps) {
  return (
    <div className="space-y-4">
      <Label>Colors</Label>
      <div className="space-y-3 rounded-lg border p-3">
        <div>
          <Label className="text-xs">Background Color</Label>
          <div className="mt-1 flex gap-2">
            <Input
              type="color"
              value={styles.backgroundColor}
              onChange={(e) =>
                onStylesChange({
                  ...styles,
                  backgroundColor: e.target.value,
                })
              }
              className="h-8 w-16 p-1"
            />
            <Input
              type="text"
              value={styles.backgroundColor}
              onChange={(e) =>
                onStylesChange({
                  ...styles,
                  backgroundColor: e.target.value,
                })
              }
              className="h-8 flex-1 text-xs"
              placeholder="#ffffff"
            />
          </div>
        </div>
        <div>
          <Label className="text-xs">Background Gradient (CSS)</Label>
          <Input
            type="text"
            value={styles.backgroundGradient || ""}
            onChange={(e) =>
              onStylesChange({
                ...styles,
                backgroundGradient: e.target.value || undefined,
              })
            }
            className="mt-1 h-8 text-xs"
            placeholder="linear-gradient(180deg, #fff 0%, #f0f0f0 100%)"
          />
        </div>
      </div>
    </div>
  );
}
