"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { IconArrowRight, IconCircleCheck, IconCode, IconBolt, IconShield, IconSearch, IconSparkles } from "@tabler/icons-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function LandingPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Easy FAQ Generator - FAQ Generator Tool",
      "applicationCategory": "WebApplication",
      "description": "FAQ generator tool and no code platform for creating beautiful FAQ sections. Use our FAQ creator tool to build SEO-optimized FAQ embeds with structured data, improve search rankings, and enhance user experience. No coding required.",
      "url": typeof window !== 'undefined' ? window.location.origin : "https://faq-generator.com",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "FAQ Generator Tool",
        "No Code Platform",
        "FAQ Creator Tool",
        "SEO Optimized FAQ Sections",
        "Structured Data Support",
        "Customizable Templates",
        "Easy Embed Integration",
        "Mobile Responsive",
        "Secure Embed Code"
      ],
      "keywords": "no code platform, faq creator tool, faq generator tool"
    };

    const faqStructuredData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is Easy FAQ Generator and how does it work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Easy FAQ Generator is a cloud-based no code platform that helps users create beautiful, SEO-optimized FAQ sections for their websites. Instead of writing code, you access the platform securely via a web browser. You can design, customize, and generate embed code for FAQ sections that include structured data for better search engine visibility. All templates and styles are managed in the cloud, so you always get the latest features without manual updates."
          }
        },
        {
          "@type": "Question",
          "name": "Who is this tool best for?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "This FAQ creator tool is ideal for small businesses, marketing teams, content creators, and website owners looking to boost SEO rankings, improve user experience, and streamline customer support. It works well for teams of all sizes because it's built to be flexible and scalable, requiring no technical expertise."
          }
        },
        {
          "@type": "Question",
          "name": "What features are included in each pricing plan?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We offer tiered pricing plans designed for different needs: Starter plan includes core features and essentials for creating basic FAQ sections. Pro plan includes advanced customization tools, multiple templates, and integrations. Enterprise plan provides full access with custom support, onboarding, and priority assistance. Each plan clearly lists included features, so you can choose what matches your use case."
          }
        },
        {
          "@type": "Question",
          "name": "Is there a trial or free plan?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes — we offer a trial option so you can experience key features before committing to a paid plan. You can upgrade or switch plans anytime without losing your data or FAQ configurations."
          }
        },
        {
          "@type": "Question",
          "name": "How do I get started with Easy FAQ Generator?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Getting started is simple — sign up using your email, choose a plan, and follow our guided setup wizard. You'll also find step-by-step tutorials and onboarding resources to help you create your first FAQ section quickly. Our no code platform makes it easy to design, customize, and embed FAQ sections in just minutes."
          }
        },
        {
          "@type": "Question",
          "name": "What integrations does the product support?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Easy FAQ Generator integrates with popular CMS platforms and websites through simple embed code. The generated FAQ sections work with any website, CMS, or platform that supports JavaScript embeds. If you need custom integrations, our embed code is flexible and can be easily extended to fit your specific needs."
          }
        },
        {
          "@type": "Question",
          "name": "What happens to my data if I cancel my subscription?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "If you cancel, your data remains secure and accessible for a defined retention period. You can export all your FAQ data and configurations at any time in standard formats before or after cancellation. Your existing embed codes will continue to work during the retention period."
          }
        },
        {
          "@type": "Question",
          "name": "Is my data secure? What compliance do you follow?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Protecting your data is a top priority. Our platform uses encryption in transit and at rest, role-based access controls, and adheres to industry-standard compliance practices to keep your information safe and private. All FAQ embeds are protected with license validation to ensure secure access."
          }
        },
        {
          "@type": "Question",
          "name": "Can I customize the platform to fit my workflow?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes — you can configure settings, choose from multiple templates, customize colors, fonts, spacing, and adjust styles to match your brand. Our FAQ creator tool offers extensive customization options that make it flexible for a variety of use cases, all without writing any code."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer training or customer support?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We provide comprehensive support including help documentation, video tutorials, email support, and onboarding guides. Some plans include dedicated support or priority assistance to help you succeed faster with your FAQ sections."
          }
        },
        {
          "@type": "Question",
          "name": "How often is the product updated?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our team continuously enhances the platform with new templates, features, performance improvements, and security updates. Updates are automatically available to all users — there's no manual installation needed. New templates and features are added regularly to keep your FAQ sections modern and effective."
          }
        },
        {
          "@type": "Question",
          "name": "How does this product compare to alternatives?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Compared to alternatives, Easy FAQ Generator stands out with easier setup, better SEO optimization through built-in structured data, more affordable pricing, superior customization options, and a true no code platform approach. You can try it risk-free to see how it fits your needs and improves your search rankings."
          }
        }
      ]
    };

    const script1 = document.createElement("script");
    script1.type = "application/ld+json";
    script1.text = JSON.stringify(structuredData);
    script1.id = "structured-data";
    
    const script2 = document.createElement("script");
    script2.type = "application/ld+json";
    script2.text = JSON.stringify(faqStructuredData);
    script2.id = "faq-structured-data";
    
    // Remove existing scripts if present
    const existing1 = document.getElementById("structured-data");
    if (existing1) existing1.remove();
    
    const existing2 = document.getElementById("faq-structured-data");
    if (existing2) existing2.remove();
    
    document.head.appendChild(script1);
    document.head.appendChild(script2);
    
    return () => {
      const scriptToRemove1 = document.getElementById("structured-data");
      if (scriptToRemove1) scriptToRemove1.remove();
      
      const scriptToRemove2 = document.getElementById("faq-structured-data");
      if (scriptToRemove2) scriptToRemove2.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <IconSparkles className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Easy FAQ Generator</span>
            </div>
            <div className="flex items-center gap-3">
              <SignInButton mode="modal" forceRedirectUrl="/editor">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              {isLoaded && isSignedIn ? (
                <Button size="sm" onClick={() => router.push("/editor")}>
                  Get Started
                </Button>
              ) : (
                <SignUpButton mode="modal" forceRedirectUrl="/editor">
                  <Button size="sm">
                    Get Started
                  </Button>
                </SignUpButton>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Two Column */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32" aria-label="Hero section for FAQ generator tool">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                FAQ Generator Tool -{" "}
                <span className="text-primary">No Code Platform</span> for FAQ Creator
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                The best <strong>FAQ generator tool</strong> and <strong>no code platform</strong> for creating beautiful FAQ sections. 
                Use our <strong>FAQ creator tool</strong> to build SEO-optimized FAQ embeds that boost your search rankings. 
                No coding required—design, customize, and embed in minutes.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {isLoaded && isSignedIn ? (
                <Button size="lg" className="group" onClick={() => router.push("/editor")}>
                  Start Creating
                  <IconArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              ) : (
                <SignUpButton mode="modal" forceRedirectUrl="/editor">
                  <Button size="lg" className="group">
                    Start Creating
                    <IconArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </SignUpButton>
              )}
              <Link href="/templates">
                <Button size="lg" variant="outline">
                  View Templates
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <IconCircleCheck className="h-5 w-5 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <IconCircleCheck className="h-5 w-5 text-primary" />
                <span>No coding required</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual/Preview */}
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden border border-border bg-card shadow-2xl">
              <Image
                src="/hero-faq-preview.png"
                alt="FAQ Generator Tool - No Code Platform FAQ Creator Preview"
                width={600}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            <div className="absolute -z-10 -inset-4 bg-primary/5 rounded-xl blur-2xl" />
          </div>
        </div>
      </section>

      {/* No Code Platform Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 border-t border-border/40 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold">
              The Best No Code Platform for FAQ Creation
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our <strong>FAQ generator tool</strong> is the perfect <strong>no code platform</strong> for anyone who wants to create 
              professional FAQ sections without technical expertise. Whether you're a marketer, business owner, or content creator, 
              our <strong>FAQ creator tool</strong> makes it easy to build, customize, and deploy beautiful FAQ sections in minutes—no coding skills required.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">No Code Required</CardTitle>
                <CardDescription>
                  Build professional FAQ sections using our intuitive visual editor. No programming knowledge needed.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Easy to Use</CardTitle>
                <CardDescription>
                  Our FAQ generator tool gives you everything you need to create and embed FAQ sections quickly and easily.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Easy FAQ Creator</CardTitle>
                <CardDescription>
                  Use our FAQ creator tool to add questions, customize styles, and generate embed code in just a few clicks.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 border-t border-border/40">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Why Choose Our FAQ Generator Tool?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            As a leading <strong>no code platform</strong> and <strong>FAQ creator tool</strong>, we provide powerful features 
            designed to help you build, customize, and deploy FAQ sections that drive results—all without writing a single line of code.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <IconSearch className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>SEO Optimized</CardTitle>
              <CardDescription>
                Built-in structured data and semantic HTML to boost your search engine rankings and improve visibility.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <IconBolt className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Embed code loads instantly and doesn't slow down your site. Optimized for performance.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <IconCode className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Easy Integration</CardTitle>
              <CardDescription>
                Copy and paste a single line of code. Works with any website, CMS, or platform.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <IconSparkles className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Fully Customizable</CardTitle>
              <CardDescription>
                Choose from beautiful templates or design your own. Control colors, fonts, spacing, and more.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <IconShield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Secure & Reliable</CardTitle>
              <CardDescription>
                Protected embeds with license validation. Your content stays safe and always accessible.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <IconCircleCheck className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Mobile Responsive</CardTitle>
              <CardDescription>
                Looks perfect on all devices. Automatically adapts to any screen size for the best user experience.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA in Benefits Section */}
        <div className="mt-16 text-center">
          {isLoaded && isSignedIn ? (
            <Button size="lg" className="group" onClick={() => router.push("/editor")}>
              Start Building Your FAQs
              <IconArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          ) : (
            <SignUpButton mode="modal" forceRedirectUrl="/editor">
              <Button size="lg" className="group">
                Start Building Your FAQs
                <IconArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </SignUpButton>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 border-t border-border/40" id="faq">
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about our FAQ generator tool and no code platform
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger value="item-1">
                What is Easy FAQ Generator and how does it work?
              </AccordionTrigger>
              <AccordionContent value="item-1">
                Easy FAQ Generator is a cloud-based no code platform that helps users create beautiful, SEO-optimized FAQ sections for their websites. Instead of writing code, you access the platform securely via a web browser. You can design, customize, and generate embed code for FAQ sections that include structured data for better search engine visibility. All templates and styles are managed in the cloud, so you always get the latest features without manual updates.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger value="item-2">
                Who is this tool best for?
              </AccordionTrigger>
              <AccordionContent value="item-2">
                This FAQ creator tool is ideal for small businesses, marketing teams, content creators, and website owners looking to boost SEO rankings, improve user experience, and streamline customer support. It works well for teams of all sizes because it's built to be flexible and scalable, requiring no technical expertise.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger value="item-3">
                What features are included in each pricing plan?
              </AccordionTrigger>
              <AccordionContent value="item-3">
                We offer tiered pricing plans designed for different needs: Starter plan includes core features and essentials for creating basic FAQ sections. Pro plan includes advanced customization tools, multiple templates, and integrations. Enterprise plan provides full access with custom support, onboarding, and priority assistance. Each plan clearly lists included features, so you can choose what matches your use case.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger value="item-4">
                Is there a trial or free plan?
              </AccordionTrigger>
              <AccordionContent value="item-4">
                Yes — we offer a trial option so you can experience key features before committing to a paid plan. You can upgrade or switch plans anytime without losing your data or FAQ configurations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger value="item-5">
                How do I get started with Easy FAQ Generator?
              </AccordionTrigger>
              <AccordionContent value="item-5">
                Getting started is simple — sign up using your email, choose a plan, and follow our guided setup wizard. You'll also find step-by-step tutorials and onboarding resources to help you create your first FAQ section quickly. Our no code platform makes it easy to design, customize, and embed FAQ sections in just minutes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger value="item-6">
                What integrations does the product support?
              </AccordionTrigger>
              <AccordionContent value="item-6">
                Easy FAQ Generator integrates with popular CMS platforms and websites through simple embed code. The generated FAQ sections work with any website, CMS, or platform that supports JavaScript embeds. If you need custom integrations, our embed code is flexible and can be easily extended to fit your specific needs.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger value="item-7">
                What happens to my data if I cancel my subscription?
              </AccordionTrigger>
              <AccordionContent value="item-7">
                If you cancel, your data remains secure and accessible for a defined retention period. You can export all your FAQ data and configurations at any time in standard formats before or after cancellation. Your existing embed codes will continue to work during the retention period.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger value="item-8">
                Is my data secure? What compliance do you follow?
              </AccordionTrigger>
              <AccordionContent value="item-8">
                Protecting your data is a top priority. Our platform uses encryption in transit and at rest, role-based access controls, and adheres to industry-standard compliance practices to keep your information safe and private. All FAQ embeds are protected with license validation to ensure secure access.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
              <AccordionTrigger value="item-9">
                Can I customize the platform to fit my workflow?
              </AccordionTrigger>
              <AccordionContent value="item-9">
                Yes — you can configure settings, choose from multiple templates, customize colors, fonts, spacing, and adjust styles to match your brand. Our FAQ creator tool offers extensive customization options that make it flexible for a variety of use cases, all without writing any code.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10">
              <AccordionTrigger value="item-10">
                Do you offer training or customer support?
              </AccordionTrigger>
              <AccordionContent value="item-10">
                We provide comprehensive support including help documentation, video tutorials, email support, and onboarding guides. Some plans include dedicated support or priority assistance to help you succeed faster with your FAQ sections.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-11">
              <AccordionTrigger value="item-11">
                How often is the product updated?
              </AccordionTrigger>
              <AccordionContent value="item-11">
                Our team continuously enhances the platform with new templates, features, performance improvements, and security updates. Updates are automatically available to all users — there's no manual installation needed. New templates and features are added regularly to keep your FAQ sections modern and effective.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-12">
              <AccordionTrigger value="item-12">
                How does this product compare to alternatives?
              </AccordionTrigger>
              <AccordionContent value="item-12">
                Compared to alternatives, Easy FAQ Generator stands out with easier setup, better SEO optimization through built-in structured data, more affordable pricing, superior customization options, and a true no code platform approach. You can try it risk-free to see how it fits your needs and improves your search rankings.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 border-t border-border/40">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Start Using Our FAQ Generator Tool Today
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of websites using our <strong>no code platform</strong> and <strong>FAQ creator tool</strong> 
              to improve their search visibility and user experience. Get started with our <strong>FAQ generator tool</strong> today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isLoaded && isSignedIn ? (
              <Button size="lg" className="group" onClick={() => router.push("/editor")}>
                Get Started
                <IconArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            ) : (
              <SignUpButton mode="modal" forceRedirectUrl="/editor">
                <Button size="lg" className="group">
                  Get Started
                  <IconArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </SignUpButton>
            )}
            <Link href="/templates">
              <Button size="lg" variant="outline">
                Explore Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconSparkles className="h-5 w-5" />
              <span className="text-sm">Easy FAQ Generator</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/templates" className="hover:text-foreground transition-colors">
                Templates
              </Link>
              <SignInButton mode="modal" forceRedirectUrl="/editor">
                <button className="hover:text-foreground transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
