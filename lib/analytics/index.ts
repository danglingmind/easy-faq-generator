/**
 * Analytics Module Exports
 * Central entry point for analytics functionality
 */

export { getAnalytics } from "./google-analytics";
export { usePageView } from "./hooks";
export { trackEvent, trackPageView } from "./track";
export type { IAnalyticsProvider, PageViewEvent, CustomEvent, BaseEventParams } from "./types";
