/**
 * Frontend helper for CSRF token management
 * These functions can be used in client components to handle CSRF tokens
 */

/**
 * Get CSRF token from cookie
 */
export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split('; ');
  const csrfCookie = cookies.find(row => row.startsWith('csrf_token='));
  return csrfCookie ? csrfCookie.split('=')[1] : null;
}

/**
 * Add CSRF token to fetch request headers
 */
export function addCsrfHeader(headers: HeadersInit = {}): HeadersInit {
  const token = getCsrfToken();
  if (!token) return headers;

  const headersObj = headers instanceof Headers 
    ? Object.fromEntries(headers.entries())
    : Array.isArray(headers)
    ? Object.fromEntries(headers)
    : headers;

  return {
    ...headersObj,
    'X-CSRF-Token': token,
  };
}

/**
 * Fetch wrapper that automatically adds CSRF token
 */
export async function fetchWithCsrf(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getCsrfToken();
  const headers = new Headers(options.headers);

  if (token) {
    headers.set('X-CSRF-Token', token);
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include cookies
  });
}

