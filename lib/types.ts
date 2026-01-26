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
  | "Default"
  | "Serif"
  | "Mono"
  | "Sans"
  | "Inter"
  | "Roboto"
  | "Open Sans"
  | "Lato"
  | "Montserrat"
  | "Poppins";

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
