'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useRef } from 'react';

// Initialize PostHog only once
const initPostHog = () => {
  // Skip initialization if we're not in the browser
  if (typeof window === 'undefined') return;

  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

  if (!posthogKey) {
    console.warn('PostHog key is not set. Analytics will be disabled.');
    return;
  }

  try {
    // Simple configuration
    posthog.init(posthogKey, {
      api_host: posthogHost,
      capture_pageview: false, // We'll handle pageviews manually
      autocapture: process.env.NODE_ENV === 'production',
      disable_session_recording: process.env.NODE_ENV !== 'production',
      loaded: (ph) => {
        if (process.env.NODE_ENV === 'development') {
          ph.debug();
        }
        // Mark as loaded
        (window as any).posthog = ph;
      }
    });
  } catch (error) {
    console.error('Failed to initialize PostHog:', error);
  }
};

// Initialize PostHog when the module loads
initPostHog();

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>;
}

// Separate component for page view tracking
export function PostHogPageView() {
  // This is a client component that will be used in a Suspense boundary
  const View = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const hasTrackedRef = useRef(false);

    useEffect(() => {
      // Only track once per page load
      if (hasTrackedRef.current || !pathname) return;
      
      // Ensure PostHog is loaded
      if (typeof window === 'undefined' || !(window as any).posthog) {
        console.warn('PostHog not loaded, skipping pageview tracking');
        return;
      }

      try {
        // Track pageview
        let url = window.origin + pathname;
        if (searchParams?.toString()) {
          url = url + `?${searchParams.toString()}`;
        }
        
        posthog.capture('$pageview', {
          $current_url: url,
        });
        
        hasTrackedRef.current = true;
      } catch (error) {
        console.error('Failed to track pageview:', error);
      }
    }, [pathname, searchParams]);

    return null;
  };

  return (
    <Suspense fallback={null}>
      <View />
    </Suspense>
  );
}
