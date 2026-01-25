"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { IconArrowRight, IconCircleCheck, IconCode, IconBolt, IconShield, IconSearch, IconSparkles } from "@tabler/icons-react";

export function LandingPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "FAQ Generator",
      "applicationCategory": "WebApplication",
      "description": "Generate beautiful, SEO-optimized FAQ sections for your website. Create custom FAQ embeds with structured data, improve search rankings, and enhance user experience.",
      "url": typeof window !== 'undefined' ? window.location.origin : "https://faq-generator.com",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "SEO Optimized FAQ Sections",
        "Structured Data Support",
        "Customizable Templates",
        "Easy Embed Integration",
        "Mobile Responsive",
        "Secure Embed Code"
      ]
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    script.id = "structured-data";
    
    // Remove existing script if present
    const existing = document.getElementById("structured-data");
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);
    
    return () => {
      const scriptToRemove = document.getElementById("structured-data");
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
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
              <span className="text-lg font-semibold">FAQ Generator</span>
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
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Create Beautiful,{" "}
                <span className="text-primary">SEO-Optimized</span> FAQ Sections
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Generate professional FAQ embeds that boost your search rankings and improve user experience. 
                No coding required—design, customize, and embed in minutes.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {isLoaded && isSignedIn ? (
                <Button size="lg" className="group" onClick={() => router.push("/editor")}>
                  Start Creating Free
                  <IconArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              ) : (
                <SignUpButton mode="modal" forceRedirectUrl="/editor">
                  <Button size="lg" className="group">
                    Start Creating Free
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
                <span>Free to start</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual/Preview */}
          <div className="relative">
            <div className="relative rounded-xl overflow-hidden border border-border bg-card shadow-2xl">
              <Image
                src="/hero-faq-preview.png"
                alt="FAQ Section Preview - Q&A accordion interface"
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

      {/* Benefits Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 border-t border-border/40">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Everything You Need to Create Perfect FAQs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you build, customize, and deploy FAQ sections that drive results.
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

      {/* Final CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 border-t border-border/40">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Ready to Boost Your SEO Rankings?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of websites using our FAQ generator to improve their search visibility and user experience.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isLoaded && isSignedIn ? (
              <Button size="lg" className="group" onClick={() => router.push("/editor")}>
                Get Started Free
                <IconArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            ) : (
              <SignUpButton mode="modal" forceRedirectUrl="/editor">
                <Button size="lg" className="group">
                  Get Started Free
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
              <span className="text-sm">FAQ Generator</span>
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
