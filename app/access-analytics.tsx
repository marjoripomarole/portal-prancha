'use client';
import {Analytics} from '@vercel/analytics/next';
import {sanitizeAnalyticsEvent} from '@/lib/analytics-policy.mjs';

// Independent of login, study requests and progress persistence.
export default function AccessAnalytics() {
  return <Analytics beforeSend={sanitizeAnalyticsEvent} debug={false}/>;
}
