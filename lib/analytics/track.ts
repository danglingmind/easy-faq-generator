/**
 * Analytics Tracking Utilities
 * Convenience functions for tracking events
 */

import { getAnalytics } from "./google-analytics";
import type { CustomEvent, BaseEventParams } from "./types";

/**
 * Track a custom event
 * @param eventName - Name of the event
 * @param params - Optional event parameters
 */
export function trackEvent(eventName: string, params?: BaseEventParams): void {
  const analytics = getAnalytics();
  if (!analytics.isEnabled()) return;

  analytics.trackEvent({
    event_name: eventName,
    event_params: params,
  });
}

/**
 * Track page view manually
 * @param path - Page path
 * @param title - Optional page title
 */
export function trackPageView(path: string, title?: string): void {
  const analytics = getAnalytics();
  if (!analytics.isEnabled()) return;

  analytics.trackPageView({
    page_path: path,
    page_title: title,
    page_location: typeof window !== "undefined" ? window.location.href : undefined,
  });
}
