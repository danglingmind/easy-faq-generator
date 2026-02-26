"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ColorInput } from "@/components/ui/color-input";
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
          <div className="mt-1">
            <ColorInput
              value={styles.backgroundColor}
              onChange={(value) =>
                onStylesChange({ ...styles, backgroundColor: value })
              }
              placeholder="#ffffff, rgba(255,255,255,0.9), hsl(0,0%,100%)"
            />
          </div>
        </div>
        <div>
          <Label className="text-xs">Background Gradient (CSS)</Label>
          <div className="mt-1">
            <ColorInput
              value={styles.backgroundGradient || ""}
              onChange={(value) =>
                onStylesChange({
                  ...styles,
                  backgroundGradient: value || undefined,
                })
              }
              placeholder="linear-gradient(180deg, #fff 0%, #f0f0f0 100%)"
              noNativePicker
            />
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">
            When set, gradient overrides the background color above.
          </p>
        </div>
      </div>
    </div>
  );
}
