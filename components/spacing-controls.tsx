"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FAQStyles } from "@/lib/types";

interface SpacingControlsProps {
  styles: FAQStyles;
  onStylesChange: (styles: FAQStyles) => void;
}

export function SpacingControls({
  styles,
  onStylesChange,
}: SpacingControlsProps) {
  return (
    <div className="space-y-4">
      <Label>Spacing</Label>
      <div className="space-y-3 rounded-lg border p-3">
        <div>
          <Label className="text-xs">Section Padding</Label>
          <Input
            type="number"
            value={styles.spacing.sectionPadding}
            onChange={(e) =>
              onStylesChange({
                ...styles,
                spacing: {
                  ...styles.spacing,
                  sectionPadding: parseInt(e.target.value) || 0,
                },
              })
            }
            className="mt-1 h-8 text-xs"
          />
        </div>
        <div>
          <Label className="text-xs">Item Spacing</Label>
          <Input
            type="number"
            value={styles.spacing.itemSpacing}
            onChange={(e) =>
              onStylesChange({
                ...styles,
                spacing: {
                  ...styles.spacing,
                  itemSpacing: parseInt(e.target.value) || 0,
                },
              })
            }
            className="mt-1 h-8 text-xs"
          />
        </div>
      </div>
    </div>
  );
}
