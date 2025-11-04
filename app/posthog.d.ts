// Extend the Window interface to include the posthog property
declare global {
  interface Window {
    posthog?: {
      __loaded?: boolean;
    } & typeof import('posthog-js');
  }
}

export {}; // This file needs to be a module
