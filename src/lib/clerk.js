import { ClerkProvider } from '@clerk/clerk-react';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Changed from clerkConfig to clerkOptions to match the import
export const clerkOptions = {
  publishableKey,
  appearance: {
    debug: process.env.NODE_ENV === 'development'
  }
};

export { ClerkProvider };