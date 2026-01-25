import { LandingPage } from "@/components/landing-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ Generator - Create SEO-Optimized FAQ Sections | Free FAQ Embed Builder",
  description: "Generate beautiful, SEO-optimized FAQ sections for your website. Create custom FAQ embeds with structured data, improve search rankings, and enhance user experience. Free to start, no coding required.",
  keywords: [
    "FAQ generator",
    "FAQ builder",
    "FAQ embed",
    "SEO FAQ",
    "FAQ section builder",
    "FAQ widget",
    "FAQ embed code",
    "structured data FAQ",
    "FAQ accordion",
    "FAQ plugin",
    "FAQ tool",
    "create FAQ",
    "FAQ template",
    "FAQ code generator",
    "FAQ snippet",
    "FAQ HTML generator",
    "FAQ JavaScript",
    "FAQ embed script",
    "FAQ section creator",
    "FAQ page builder"
  ],
  openGraph: {
    title: "FAQ Generator - Create SEO-Optimized FAQ Sections",
    description: "Generate beautiful, SEO-optimized FAQ sections for your website. Create custom FAQ embeds with structured data, improve search rankings, and enhance user experience.",
    type: "website",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://faq-generator.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ Generator - Create SEO-Optimized FAQ Sections",
    description: "Generate beautiful, SEO-optimized FAQ sections for your website. Free to start, no coding required.",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || "https://faq-generator.com",
  },
};

export default function Page() {
  return <LandingPage />;
}
