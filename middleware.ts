import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// CSRF validation is done in API routes, not in middleware (Edge Runtime compatibility)

// Zararlı user agent'ları ve path'leri engelle
const BLOCKED_PATTERNS = [
  /\.sh$/i,
  /\.bash$/i,
  /wget/i,
  /curl/i,
  /clean\.sh/i,
  /immunify360firewall/i,
  /xmr/i,
  /monero/i,
  /mining/i,
];

const BLOCKED_USER_AGENTS = [
  /wget/i,
  /curl/i,
  /python/i,
  /go-http/i,
  /^$/,
];

// Şüpheli IP'ler (loglardan görünen IP'ler)
const SUSPICIOUS_IPS = [
  '2.57.122.173',
  // Diğer şüpheli IP'leri buraya ekleyebilirsiniz
];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const ip = 
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  // Şüpheli IP'leri engelle
  if (SUSPICIOUS_IPS.includes(ip)) {
    console.warn(`[SECURITY] Blocked suspicious IP: ${ip} from ${pathname}`);
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Zararlı path pattern'lerini engelle
  const fullPath = pathname + search;
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(fullPath)) {
      console.warn(`[SECURITY] Blocked malicious path: ${fullPath} from IP: ${ip}`);
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  // Zararlı user agent'ları engelle
  for (const pattern of BLOCKED_USER_AGENTS) {
    if (pattern.test(userAgent)) {
      console.warn(`[SECURITY] Blocked suspicious user agent: ${userAgent} from IP: ${ip}`);
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  // API endpoint'lerine güvenlik header'ları ekle
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    // CORS ve güvenlik header'ları
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // API için CORS - tam eşleşme kontrolü (subdomain matching'i önlemek için)
    const origin = request.headers.get('origin');
    const allowedOrigins = [
      'https://kolektifyazilim.com',
      'https://www.kolektifyazilim.com',
      'http://localhost:3000',
      'http://localhost:3001',
    ];
    
    // Exact match kontrolü - includes() yerine tam eşleşme
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
      response.headers.set('Access-Control-Max-Age', '86400');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    
    // OPTIONS isteklerini handle et
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }

    // CSRF validation is handled in individual API routes for better error handling
    // and Edge Runtime compatibility (crypto module is not available in Edge Runtime)

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};

