import { LandingPage } from "@/components/landing-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ Generator Tool - No Code Platform for FAQ Creator | Easy FAQ Generator",
  description: "The best FAQ generator tool and no code platform for creating beautiful FAQ sections. Use our FAQ creator tool to build SEO-optimized FAQ embeds with structured data. No coding required - get started today.",
  keywords: [
    "no code platform",
    "faq creator tool",
    "faq generator tool",
    "FAQ generator",
    "FAQ builder",
    "FAQ creator",
    "no code FAQ builder",
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
    "FAQ page builder",
    "no code solution"
  ],
  openGraph: {
    title: "FAQ Generator Tool - No Code Platform for FAQ Creator",
    description: "The best FAQ generator tool and no code platform for creating beautiful FAQ sections. Use our FAQ creator tool to build SEO-optimized FAQ embeds with structured data. No coding required.",
    type: "website",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://faq-generator.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ Generator Tool - No Code Platform for FAQ Creator",
    description: "The best FAQ generator tool and no code platform for creating beautiful FAQ sections. No coding required - get started today.",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || "https://faq-generator.com",
  },
};

export default function Page() {
  return <LandingPage />;
}
