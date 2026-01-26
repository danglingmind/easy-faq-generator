import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ Templates | Beautiful, SEO-Optimized FAQ Sections",
  description: "Browse our collection of beautiful, SEO-optimized FAQ section templates. Works seamlessly with Webflow, Showit, Squarespace, WordPress, and any website platform. Customizable FAQ sections with structured data, responsive design, and easy integration.",
  keywords: [
    "FAQ section templates",
    "FAQ section Webflow",
    "FAQ section Showit",
    "FAQ section Squarespace",
    "SEO optimized FAQ",
    "customized FAQ section",
    "Easy FAQ section",
    "FAQ template Webflow",
    "FAQ template Showit",
    "FAQ template Squarespace",
    "FAQ section builder",
    "FAQ embed templates",
    "responsive FAQ section",
    "FAQ section with structured data",
    "FAQ accordion templates",
    "FAQ section for websites",
    "FAQ section generator",
    "FAQ section creator",
    "FAQ section design",
    "FAQ section code",
    "FAQ section HTML",
    "FAQ section widget",
    "FAQ section plugin",
    "FAQ section tool",
  ],
  openGraph: {
    title: "FAQ Templates | Beautiful, SEO-Optimized FAQ Sections",
    description: "Browse our collection of beautiful, SEO-optimized FAQ section templates. Works seamlessly with Webflow, Showit, Squarespace, WordPress, and any website platform.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_APP_URL || "https://easy-faq-generator.fly.dev"}/templates`,
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ Templates | Beautiful, SEO-Optimized FAQ Sections",
    description: "Browse our collection of beautiful, SEO-optimized FAQ section templates. Works seamlessly with any website platform.",
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || "https://easy-faq-generator.fly.dev"}/templates`,
  },
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "FAQ Section Templates",
            description: "Browse our collection of SEO-optimized FAQ section templates for Webflow, Showit, Squarespace, and other website platforms.",
            url: `${process.env.NEXT_PUBLIC_APP_URL || "https://easy-faq-generator.fly.dev"}/templates`,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Default FAQ Template",
                  description: "Clean and simple accordion layout",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Minimal FAQ Template",
                  description: "Minimalist design with subtle borders",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Card FAQ Template",
                  description: "Card-based layout with shadows",
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: "Bordered FAQ Template",
                  description: "Strong borders and clear separation",
                },
                {
                  "@type": "ListItem",
                  position: 5,
                  name: "Split FAQ Template",
                  description: "Two-column layout with dark green background",
                },
              ],
            },
          }),
        }}
      />
    </>
  );
}
