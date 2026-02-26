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
import { ColorInput } from "@/components/ui/color-input";
import { FAQStyles } from "@/lib/types";

interface TypographyControlsProps {
  styles: FAQStyles;
  onStylesChange: (styles: FAQStyles) => void;
}

const fontFamilies = [
  // System fonts
  "Default",
  "Serif",
  "Mono",
  "Sans",
  // Popular Google Fonts - Sans Serif
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Nunito",
  "Raleway",
  "Source Sans Pro",
  "Ubuntu",
  "Work Sans",
  "DM Sans",
  "Noto Sans",
  "Oswald",
  "PT Sans",
  "Fira Sans",
  "Cabin",
  "Quicksand",
  "Dosis",
  "Barlow",
  "Rubik",
  "Manrope",
  "Plus Jakarta Sans",
  "Outfit",
  "Figtree",
  "Space Grotesk",
  "Sora",
  "Epilogue",
  "Lexend",
  "Red Hat Display",
  "IBM Plex Sans",
  "Public Sans",
  "Karla",
  "Hind",
  "Titillium Web",
  "Varela Round",
  "Maven Pro",
  "Comfortaa",
  "Josefin Sans",
  "Libre Franklin",
  // Serif fonts
  "Playfair Display",
  "Merriweather",
  "Crimson Text",
  "Lora",
  "PT Serif",
  "Source Serif Pro",
  "Crimson Pro",
  "Libre Baskerville",
  "EB Garamond",
  "Bitter",
  "Noto Serif",
  "Roboto Slab",
  "Zilla Slab",
  "Bree Serif",
  "Crete Round",
  "Vollkorn",
  "Alegreya",
  "Cormorant Garamond",
  "Gentium Book Basic",
  "Lusitana",
  "Old Standard TT",
  "Spectral",
  "Cinzel",
  "Prata",
  "Playfair Display SC",
  "Bodoni Moda",
  "Cormorant",
  "Fraunces",
  "Libre Caslon Display",
  "Yeseva One",
  // Script/Handwriting fonts
  "Dancing Script",
  "Pacifico",
  "Satisfy",
  "Great Vibes",
  "Kalam",
  "Permanent Marker",
  "Caveat",
  "Shadows Into Light",
  "Amatic SC",
  // Display fonts
  "Bangers",
  "Fredoka One",
  "Righteous",
  "Lobster",
  "Bebas Neue",
  "Anton",
  "Fjalla One",
  "Archivo Black",
  "Black Ops One",
  "Orbitron",
  "Rajdhani",
  "Exo 2",
  "Teko",
  "Russo One",
  "Abril Fatface",
  "Alfa Slab One",
  "Bungee",
  "Fugaz One",
  "Luckiest Guy",
  "Passion One",
  "Patua One",
  "Staatliches",
  "Titan One",
  // Monospace fonts
  "Fira Code",
  "JetBrains Mono",
  "Source Code Pro",
  "Roboto Mono",
  "Space Mono",
  "Courier Prime",
  "Inconsolata",
  "PT Mono",
  "Overpass Mono",
  "Anonymous Pro",
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
                <div className="mt-1">
                  <ColorInput
                    value={styles[element].color}
                    onChange={(value) =>
                      updateTypography(element, "color", value)
                    }
                    placeholder="#000000, rgba(0,0,0,0.8), hsl(0,0%,10%)"
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
