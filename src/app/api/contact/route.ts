import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { rateLimit } from '@/lib/rateLimit';
import * as messageService from '@/lib/services/messageService';

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  content: z.string().min(1).max(10_000),
  // honeypot: bots fill this, humans won't
  website: z.string().max(2000).optional(),
});

export async function GET(request: Request) {
  const authRes = await requireAdmin(request);
  if (authRes) return authRes;

  try {
    const messages = await messageService.getAllMessages();
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const rl = rateLimit(request, 'contact:post', { windowMs: 60_000, max: 5 });
  if (!rl.ok) {
    return NextResponse.json(
      { success: false, error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON' },
      { status: 400 }
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid payload' },
      { status: 400 }
    );
  }

  // Honeypot: pretend success without storing
  if (parsed.data.website && parsed.data.website.trim().length > 0) {
    return NextResponse.json({ success: true });
  }

  try {
    await messageService.createMessage({
    name: parsed.data.name,
    email: parsed.data.email,
    content: parsed.data.content,
    });
  return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create message' },
      { status: 500 }
    );
  }
}
