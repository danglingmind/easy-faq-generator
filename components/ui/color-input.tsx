"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";

interface ColorInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  /** When true, hides the native color picker (useful for gradient-only fields) */
  noNativePicker?: boolean;
}

/**
 * A color input that accepts any valid CSS color value:
 * hex (#fff, #ffffff, #ffffffaa), rgb/rgba, hsl/hsla, named colors,
 * linear-gradient / radial-gradient, transparent, currentColor …
 *
 * A checkered swatch previews the value (transparency is visible through the
 * checkerboard). Clicking the swatch opens a native color picker as a
 * convenient hex shortcut; the text field is always the primary control.
 */
export function ColorInput({
  value,
  onChange,
  disabled,
  placeholder,
  noNativePicker = false,
}: ColorInputProps) {
  const pickerRef = useRef<HTMLInputElement>(null);

  // The native <input type="color"> only understands 6-digit hex.
  // For every other format we fall back to #000000 so the picker still opens.
  const isHex6 = /^#[0-9a-fA-F]{6}$/.test((value ?? "").trim());
  const pickerValue = isHex6 ? value.trim() : "#000000";

  const handleSwatchClick = () => {
    if (!disabled && !noNativePicker) pickerRef.current?.click();
  };

  return (
    <div className="flex gap-2">
      {/* Swatch */}
      <div
        onClick={handleSwatchClick}
        title={noNativePicker ? "Color preview" : "Click to open color picker"}
        className={[
          "relative h-8 w-10 shrink-0 overflow-hidden rounded border",
          disabled
            ? "cursor-not-allowed opacity-50"
            : noNativePicker
            ? "cursor-default"
            : "cursor-pointer",
        ].join(" ")}
        style={{
          // Checkerboard so transparency is visible
          backgroundImage: [
            "linear-gradient(45deg, #c0c0c0 25%, transparent 25%)",
            "linear-gradient(-45deg, #c0c0c0 25%, transparent 25%)",
            "linear-gradient(45deg, transparent 75%, #c0c0c0 75%)",
            "linear-gradient(-45deg, transparent 75%, #c0c0c0 75%)",
          ].join(", "),
          backgroundSize: "8px 8px",
          backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
        }}
      >
        {/* Color overlay on top of checkerboard */}
        <div
          className="absolute inset-0"
          style={{ background: value || "transparent" }}
        />
        {/* Hidden native picker — positioned off-screen, opened programmatically */}
        {!noNativePicker && (
          <input
            ref={pickerRef}
            type="color"
            value={pickerValue}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="sr-only"
            tabIndex={-1}
          />
        )}
      </div>

      {/* Free-form text input — accepts any CSS color expression */}
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder ?? "#000000"}
        className="h-8 flex-1 text-xs"
      />
    </div>
  );
}
