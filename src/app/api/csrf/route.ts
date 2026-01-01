import { NextResponse } from 'next/server';
import { generateCsrfToken } from '@/lib/csrf';

/**
 * GET /api/csrf
 * Generate and return CSRF token for public users
 * Token is set in cookie and also returned in response body
 */
export async function GET(request: Request) {
  try {
    const response = NextResponse.json({ success: true });
    const token = await generateCsrfToken(response, request);
    
    // Create new response with token in body, copying cookies from original response
    const jsonResponse = NextResponse.json({ 
      success: true,
      token
    });
    
    // Copy the CSRF cookie that was set by generateCsrfToken
    const csrfCookie = response.cookies.get('csrf_token');
    if (csrfCookie) {
      jsonResponse.cookies.set('csrf_token', csrfCookie.value, {
        httpOnly: false,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
      });
    }
    
    return jsonResponse;
  } catch (error) {
    console.error('CSRF token generation failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}

