export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQContent {
  heading: string;
  description: string;
  items: FAQItem[];
}

export type FontFamily =
  // System fonts
  | "Default"
  | "Serif"
  | "Mono"
  | "Sans"
  // Popular Google Fonts - Sans Serif
  | "Inter"
  | "Roboto"
  | "Open Sans"
  | "Lato"
  | "Montserrat"
  | "Poppins"
  | "Nunito"
  | "Raleway"
  | "Source Sans Pro"
  | "Ubuntu"
  | "Work Sans"
  | "DM Sans"
  | "Noto Sans"
  | "Oswald"
  | "Playfair Display"
  | "Merriweather"
  | "PT Sans"
  | "Fira Sans"
  | "Cabin"
  | "Quicksand"
  | "Dosis"
  | "Barlow"
  | "Rubik"
  | "Manrope"
  | "Plus Jakarta Sans"
  | "Outfit"
  | "Figtree"
  | "Space Grotesk"
  | "Sora"
  | "Epilogue"
  | "Lexend"
  | "Red Hat Display"
  | "IBM Plex Sans"
  | "Public Sans"
  | "DM Sans"
  | "Karla"
  | "Hind"
  | "Titillium Web"
  | "Varela Round"
  | "Maven Pro"
  | "Comfortaa"
  | "Josefin Sans"
  | "Libre Franklin"
  | "Crimson Text"
  | "Lora"
  | "Playfair Display"
  | "Merriweather"
  | "PT Serif"
  | "Source Serif Pro"
  | "Crimson Pro"
  | "Libre Baskerville"
  | "EB Garamond"
  | "Bitter"
  | "Noto Serif"
  | "Roboto Slab"
  | "Zilla Slab"
  | "Bree Serif"
  | "Crete Round"
  | "Dancing Script"
  | "Pacifico"
  | "Satisfy"
  | "Great Vibes"
  | "Kalam"
  | "Permanent Marker"
  | "Caveat"
  | "Shadows Into Light"
  | "Amatic SC"
  | "Bangers"
  | "Fredoka One"
  | "Righteous"
  | "Lobster"
  | "Bebas Neue"
  | "Anton"
  | "Fjalla One"
  | "Archivo Black"
  | "Black Ops One"
  | "Orbitron"
  | "Rajdhani"
  | "Exo 2"
  | "Teko"
  | "Russo One"
  | "Abril Fatface"
  | "Alfa Slab One"
  | "Bungee"
  | "Fugaz One"
  | "Luckiest Guy"
  | "Passion One"
  | "Patua One"
  | "Staatliches"
  | "Titan One"
  | "Vollkorn"
  | "Alegreya"
  | "Cormorant Garamond"
  | "Gentium Book Basic"
  | "Lusitana"
  | "Old Standard TT"
  | "Spectral"
  | "Cinzel"
  | "Prata"
  | "Playfair Display SC"
  | "Abril Fatface"
  | "Bodoni Moda"
  | "Cormorant"
  | "Fraunces"
  | "Libre Caslon Display"
  | "Yeseva One"
  | "Fira Code"
  | "JetBrains Mono"
  | "Source Code Pro"
  | "Roboto Mono"
  | "Space Mono"
  | "Courier Prime"
  | "Inconsolata"
  | "PT Mono"
  | "Overpass Mono"
  | "Anonymous Pro";

export type FontSize = "XS" | "SM" | "MD" | "LG" | "XL" | "2XL" | "3XL" | "4XL";

export type FontWeight = "Light" | "Normal" | "Medium" | "Semibold" | "Bold";

export type IconStyle = "Chevron" | "Plus";

export type AnimationType = "Fade" | "Slide" | "None";

export type BorderStyle = "solid" | "dashed" | "dotted" | "double" | "groove" | "ridge" | "inset" | "outset";

export interface TypographyStyle {
  fontFamily: FontFamily;
  fontSize: FontSize;
  fontWeight: FontWeight;
  color: string;
}

export interface FAQStyles {
  heading: TypographyStyle;
  description: TypographyStyle;
  question: TypographyStyle;
  answer: TypographyStyle;
  backgroundColor: string;
  backgroundGradient?: string;
  accordion: {
    iconStyle: IconStyle;
    animationType: AnimationType;
    animationDuration: number;
    borderColor: string;
    borderWidth: number;
    borderStyle: BorderStyle;
    borderVisible: boolean;
    borderSides: {
      top: boolean;
      right: boolean;
      bottom: boolean;
      left: boolean;
    };
    paddingX: number;
    paddingY: number;
    marginX: number;
    marginY: number;
  };
  spacing: {
    sectionPadding: number;
    itemSpacing: number;
  };
}

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  locked: boolean;
  thumbnail?: string;
}

export interface FAQConfig {
  content: FAQContent;
  template: string;
  styles: FAQStyles;
}
