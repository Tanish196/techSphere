import posthog from "posthog-js"

// Only initialize PostHog in the browser and if the key is available
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    person_profiles: 'identified_only',
    capture_pageview: false, // We handle this manually in providers.tsx
    capture_pageleave: true,
    autocapture: false, // Disable autocapture in development
    debug: process.env.NODE_ENV === "development",
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('PostHog loaded successfully');
      }
    },
    // Disable if not in production to prevent errors
    disable_session_recording: process.env.NODE_ENV !== 'production',
  });
}