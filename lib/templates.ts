import { Template } from "./types";

export const templates: Template[] = [
  {
    id: "default",
    name: "Default",
    description: "Clean and simple accordion layout",
    preview: "default",
    locked: false,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Minimalist design with subtle borders",
    preview: "minimal",
    locked: true,
  },
  {
    id: "card",
    name: "Card",
    description: "Card-based layout with shadows",
    preview: "card",
    locked: true,
  },
  {
    id: "bordered",
    name: "Bordered",
    description: "Strong borders and clear separation",
    preview: "bordered",
    locked: true,
  },
];

export const defaultStyles = {
  heading: {
    fontFamily: "Default" as const,
    fontSize: "2XL" as const,
    fontWeight: "Bold" as const,
    color: "#1a1a1a",
  },
  description: {
    fontFamily: "Default" as const,
    fontSize: "MD" as const,
    fontWeight: "Normal" as const,
    color: "#666666",
  },
  question: {
    fontFamily: "Default" as const,
    fontSize: "LG" as const,
    fontWeight: "Semibold" as const,
    color: "#1a1a1a",
  },
  answer: {
    fontFamily: "Default" as const,
    fontSize: "MD" as const,
    fontWeight: "Normal" as const,
    color: "#4a4a4a",
  },
  backgroundColor: "#ffffff",
  accordion: {
    iconStyle: "Chevron" as const,
    animationType: "Fade" as const,
    animationDuration: 300,
    borderColor: "#e5e5e5",
    borderWidth: 1,
    borderStyle: "solid" as const,
    borderVisible: true,
    borderSides: {
      top: true,
      right: true,
      bottom: true,
      left: true,
    },
    paddingX: 16,
    paddingY: 16,
    marginX: 0,
    marginY: 8,
  },
  spacing: {
    sectionPadding: 24,
    itemSpacing: 16,
  },
};
