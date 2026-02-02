/**
 * React Hooks for Analytics
 * Client-side only hooks for tracking events
 */

"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getAnalytics } from "./google-analytics";

/**
 * Hook to automatically track page views on route changes
 * Following Single Responsibility Principle - only handles page view tracking
 */
export function usePageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    const analytics = getAnalytics();
    if (!analytics.isEnabled()) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    analytics.trackPageView({
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [pathname, searchParams]);
}
