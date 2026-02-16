'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useRef } from 'react';

// Note: PostHog is initialized in instrumentation-client.ts
// This file only provides the React context wrapper

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
      if (typeof window === 'undefined' || !posthog.__loaded) {
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
        // Silently fail in development
        if (process.env.NODE_ENV === 'development') {
          console.warn('PostHog pageview tracking failed:', error);
        }
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
