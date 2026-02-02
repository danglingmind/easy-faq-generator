# Google Analytics 4 Integration

This module provides a SOLID-principles-based Google Analytics 4 (GA4) integration for the Next.js application.

## Architecture

The implementation follows SOLID principles:

- **Single Responsibility**: Each module has one clear purpose
- **Open/Closed**: Extensible via `IAnalyticsProvider` interface
- **Liskov Substitution**: Any analytics provider can replace GA4
- **Interface Segregation**: Minimal, specific interfaces
- **Dependency Inversion**: Components depend on abstractions, not concrete implementations

## Setup

1. Get your GA4 Measurement ID from [Google Analytics](https://analytics.google.com/)
2. Add to your `.env.local`:
   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
3. The analytics script is automatically loaded in the root layout

## Usage

### Automatic Page View Tracking

The `GoogleAnalytics` component in the root layout automatically tracks page views. No additional setup needed.

### Manual Event Tracking

```typescript
import { trackEvent } from "@/lib/analytics";

// Track a custom event
trackEvent("button_click", {
  button_name: "subscribe",
  location: "header",
});
```

### Using the Hook (Client Components)

```typescript
"use client";

import { usePageView } from "@/lib/analytics";

export function MyComponent() {
  // Automatically tracks page views on route changes
  usePageView();
  
  return <div>...</div>;
}
```

### Direct Service Access

```typescript
import { getAnalytics } from "@/lib/analytics";

const analytics = getAnalytics();

if (analytics.isEnabled()) {
  analytics.trackEvent({
    event_name: "custom_event",
    event_params: { key: "value" },
  });
}
```

## Files

- `types.ts` - TypeScript interfaces and types
- `google-analytics.ts` - GA4 service implementation
- `hooks.ts` - React hooks for client components
- `track.ts` - Convenience tracking functions
- `index.ts` - Module exports

## Components

- `components/analytics/google-analytics.tsx` - Script component for GA4
