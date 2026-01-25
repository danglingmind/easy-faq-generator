"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FAQStyles } from "@/lib/types";

interface TypographyControlsProps {
  styles: FAQStyles;
  onStylesChange: (styles: FAQStyles) => void;
}

const fontFamilies = [
  "Default",
  "Serif",
  "Mono",
  "Sans",
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
];

const fontSizes = ["XS", "SM", "MD", "LG", "XL", "2XL", "3XL", "4XL"];

const fontWeights = ["Light", "Normal", "Medium", "Semibold", "Bold"];

export function TypographyControls({
  styles,
  onStylesChange,
}: TypographyControlsProps) {
  const updateTypography = (
    element: "heading" | "description" | "question" | "answer",
    field: "fontFamily" | "fontSize" | "fontWeight" | "color",
    value: string
  ) => {
    onStylesChange({
      ...styles,
      [element]: {
        ...styles[element],
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <Label>Typography</Label>

      {(["heading", "description", "question", "answer"] as const).map(
        (element) => (
          <div key={element} className="space-y-2 rounded-lg border p-3">
            <Label className="text-xs font-medium capitalize">{element}</Label>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">Font Family</Label>
                <Select
                  value={styles[element].fontFamily}
                  onValueChange={(value: string | null) => {
                    if (value) {
                      updateTypography(element, "fontFamily", value);
                    }
                  }}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map((font) => (
                      <SelectItem key={font} value={font}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Font Size</Label>
                <Select
                  value={styles[element].fontSize}
                  onValueChange={(value: string | null) => {
                    if (value) {
                      updateTypography(element, "fontSize", value);
                    }
                  }}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontSizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Font Weight</Label>
                <Select
                  value={styles[element].fontWeight}
                  onValueChange={(value: string | null) => {
                    if (value) {
                      updateTypography(element, "fontWeight", value);
                    }
                  }}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontWeights.map((weight) => (
                      <SelectItem key={weight} value={weight}>
                        {weight}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={styles[element].color}
                    onChange={(e) =>
                      updateTypography(element, "color", e.target.value)
                    }
                    className="h-8 w-16 p-1"
                  />
                  <Input
                    type="text"
                    value={styles[element].color}
                    onChange={(e) =>
                      updateTypography(element, "color", e.target.value)
                    }
                    className="h-8 flex-1 text-xs"
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
