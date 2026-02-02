/**
 * Google Analytics 4 Service
 * Following SOLID Principles:
 * - Single Responsibility: Handles only GA4 analytics
 * - Open/Closed: Extensible via IAnalyticsProvider interface
 * - Liskov Substitution: Implements IAnalyticsProvider contract
 * - Interface Segregation: Uses minimal, specific interfaces
 * - Dependency Inversion: Depends on IAnalyticsProvider abstraction
 */

import type { IAnalyticsProvider, PageViewEvent, CustomEvent } from "./types";

declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "js" | "set",
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

export class GoogleAnalyticsService implements IAnalyticsProvider {
  private readonly measurementId: string | null;

  constructor() {
    this.measurementId = this.getMeasurementId();
  }

  private getMeasurementId(): string | null {
    if (typeof window === "undefined") return null;
    return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || null;
  }

  isEnabled(): boolean {
    return this.measurementId !== null && typeof window !== "undefined" && typeof window.gtag === "function";
  }

  trackPageView(params: PageViewEvent): void {
    if (!this.isEnabled() || !this.measurementId) return;

    window.gtag?.("config", this.measurementId, {
      page_path: params.page_path,
      page_title: params.page_title,
      page_location: params.page_location || window.location.href,
    });
  }

  trackEvent(event: CustomEvent): void {
    if (!this.isEnabled() || !this.measurementId) return;

    window.gtag?.("event", event.event_name, event.event_params || {});
  }
}

// Singleton instance following Dependency Inversion
let analyticsInstance: IAnalyticsProvider | null = null;

export function getAnalytics(): IAnalyticsProvider {
  if (!analyticsInstance) {
    analyticsInstance = new GoogleAnalyticsService();
  }
  return analyticsInstance;
}
