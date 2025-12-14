'use client';

import { usePageView } from '@/hooks/usePageView';

/**
 * Client component to track page views
 * Must be used in a client component context
 */
export default function PageViewTracker() {
  usePageView();
  return null;
}
