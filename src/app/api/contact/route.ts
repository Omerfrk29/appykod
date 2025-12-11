import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDB, saveDB, Message } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { rateLimit } from '@/lib/rateLimit';
import { v4 as uuidv4 } from 'uuid';

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  content: z.string().min(1).max(10_000),
  // honeypot: bots fill this, humans won't
  website: z.string().max(2000).optional(),
});

export async function GET(request: Request) {
  const authRes = requireAdmin(request);
  if (authRes) return authRes;

  const db = await getDB();
  return NextResponse.json(db.messages);
}

export async function POST(request: Request) {
  const rl = rateLimit(request, 'contact:post', { windowMs: 60_000, max: 5 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  // Honeypot: pretend success without storing
  if (parsed.data.website && parsed.data.website.trim().length > 0) {
    return NextResponse.json({ success: true });
  }

  const db = await getDB();
  const newMessage: Message = {
    id: uuidv4(),
    date: new Date().toISOString(),
    name: parsed.data.name,
    email: parsed.data.email,
    content: parsed.data.content,
  };

  db.messages.push(newMessage);
  await saveDB(db);

  return NextResponse.json({ success: true });
}
