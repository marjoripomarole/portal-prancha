// Only public page categories are sent; no query strings, fragments or study IDs.
const pages = new Set(['/', '/entrar', '/privacidade']);
export function sanitizeAnalyticsEvent(event) {
  if (event.type !== 'pageview') return null;
  try {
    const url = new URL(event.url);
    if (url.origin !== 'https://portal-prancha.vercel.app' || !pages.has(url.pathname)) return null;
    url.search = '';
    url.hash = '';
    return {...event, url:url.origin + url.pathname};
  } catch { return null; }
}
