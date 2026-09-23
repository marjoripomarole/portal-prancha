import type {BeforeSendEvent} from '@vercel/analytics/next';
export function sanitizeAnalyticsEvent(event: BeforeSendEvent): BeforeSendEvent | null;
