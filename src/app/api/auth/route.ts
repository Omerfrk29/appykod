import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const { username, password } = body;

    // Simple hardcoded auth for MVP
    if (username === 'admin' && password === 'appykod2024') {
        // In a real app, use a proper session/token
        const response = NextResponse.json({ success: true });
        response.cookies.set('auth_token', 'valid_token', { httpOnly: true, path: '/' });
        return response;
    }

    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
}
