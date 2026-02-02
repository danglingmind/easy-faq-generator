/**
 * Google Analytics 4 Event Types
 * Following Interface Segregation Principle - minimal, specific interfaces
 */

export interface BaseEventParams {
  [key: string]: string | number | boolean | undefined;
}

export interface PageViewEvent {
  page_path: string;
  page_title?: string;
  page_location?: string;
}

export interface CustomEvent {
  event_name: string;
  event_params?: BaseEventParams;
}

/**
 * Analytics Provider Interface
 * Following Dependency Inversion Principle - depend on abstractions
 */
export interface IAnalyticsProvider {
  trackPageView(params: PageViewEvent): void;
  trackEvent(event: CustomEvent): void;
  isEnabled(): boolean;
}
