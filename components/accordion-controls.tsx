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

interface AccordionControlsProps {
  styles: FAQStyles;
  onStylesChange: (styles: FAQStyles) => void;
}

export function AccordionControls({
  styles,
  onStylesChange,
}: AccordionControlsProps) {
  // Ensure all border properties exist with defaults
  const accordion = {
    ...styles.accordion,
    borderStyle: styles.accordion.borderStyle || "solid",
    borderVisible: styles.accordion.borderVisible !== undefined ? styles.accordion.borderVisible : true,
    borderSides: styles.accordion.borderSides || {
      top: true,
      right: true,
      bottom: true,
      left: true,
    },
  };

  const updateAccordion = (updates: Partial<typeof accordion>) => {
    onStylesChange({
      ...styles,
      accordion: { ...accordion, ...updates },
    });
  };

  const updateBorderSides = (side: keyof typeof accordion.borderSides, value: boolean) => {
    updateAccordion({
      borderSides: {
        ...accordion.borderSides,
        [side]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <Label>Accordion</Label>
      <div className="space-y-3 rounded-lg border p-3">
        <div>
          <Label className="text-xs">Icon Style</Label>
          <Select
            value={accordion.iconStyle}
            onValueChange={(value: "Chevron" | "Plus") =>
              updateAccordion({ iconStyle: value })
            }
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Chevron">Chevron</SelectItem>
              <SelectItem value="Plus">Plus</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Animation Type</Label>
          <Select
            value={accordion.animationType}
            onValueChange={(value: "Fade" | "Slide" | "None") =>
              updateAccordion({ animationType: value })
            }
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fade">Fade</SelectItem>
              <SelectItem value="Slide">Slide</SelectItem>
              <SelectItem value="None">None</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">
            Animation Duration: {accordion.animationDuration}ms
          </Label>
          <Input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={accordion.animationDuration}
            onChange={(e) =>
              updateAccordion({
                animationDuration: parseInt(e.target.value),
              })
            }
            className="mt-1"
          />
        </div>

        <div className="space-y-3 rounded border p-2 bg-muted/30">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Border</Label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={accordion.borderVisible}
                onChange={(e) =>
                  updateAccordion({ borderVisible: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-xs">Show Border</span>
            </label>
          </div>

          {accordion.borderVisible && (
            <>
              <div>
                <Label className="text-xs">Border Color</Label>
                <div className="mt-1 flex gap-2">
                  <Input
                    type="color"
                    value={accordion.borderColor}
                    onChange={(e) =>
                      updateAccordion({ borderColor: e.target.value })
                    }
                    className="h-8 w-16 p-1"
                  />
                  <Input
                    type="text"
                    value={accordion.borderColor}
                    onChange={(e) =>
                      updateAccordion({ borderColor: e.target.value })
                    }
                    className="h-8 flex-1 text-xs"
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Border Width</Label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  value={accordion.borderWidth}
                  onChange={(e) =>
                    updateAccordion({
                      borderWidth: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1 h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Border Style</Label>
                <Select
                  value={accordion.borderStyle}
                  onValueChange={(value: any) =>
                    updateAccordion({ borderStyle: value })
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                    <SelectItem value="dotted">Dotted</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="groove">Groove</SelectItem>
                    <SelectItem value="ridge">Ridge</SelectItem>
                    <SelectItem value="inset">Inset</SelectItem>
                    <SelectItem value="outset">Outset</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs mb-2 block">Border Sides</Label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accordion.borderSides.top}
                      onChange={(e) =>
                        updateBorderSides("top", e.target.checked)
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-xs">Top</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accordion.borderSides.right}
                      onChange={(e) =>
                        updateBorderSides("right", e.target.checked)
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-xs">Right</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accordion.borderSides.bottom}
                      onChange={(e) =>
                        updateBorderSides("bottom", e.target.checked)
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-xs">Bottom</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={accordion.borderSides.left}
                      onChange={(e) =>
                        updateBorderSides("left", e.target.checked)
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-xs">Left</span>
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Padding X</Label>
            <Input
              type="number"
              value={accordion.paddingX}
              onChange={(e) =>
                updateAccordion({
                  paddingX: parseInt(e.target.value) || 0,
                })
              }
              className="mt-1 h-8 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Padding Y</Label>
            <Input
              type="number"
              value={accordion.paddingY}
              onChange={(e) =>
                updateAccordion({
                  paddingY: parseInt(e.target.value) || 0,
                })
              }
              className="mt-1 h-8 text-xs"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Margin X</Label>
            <Input
              type="number"
              value={accordion.marginX}
              onChange={(e) =>
                updateAccordion({
                  marginX: parseInt(e.target.value) || 0,
                })
              }
              className="mt-1 h-8 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Margin Y</Label>
            <Input
              type="number"
              value={accordion.marginY}
              onChange={(e) =>
                updateAccordion({
                  marginY: parseInt(e.target.value) || 0,
                })
              }
              className="mt-1 h-8 text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
