import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { requireCsrfToken } from '@/lib/csrf';
import { handleApiError, ValidationError } from '@/lib/errors';
import * as messageService from '@/lib/services/messageService';

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  content: z.string().min(1).max(10_000),
  // honeypot: bots fill this, humans won't
  website: z.string().max(2000).optional(),
});

export async function GET(request: Request) {
  try {
    const authRes = await requireAdmin(request);
    if (authRes) return authRes;

    const messages = await messageService.getAllMessages();
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireCsrfToken(request);
    await checkRateLimit(request, 'contact:post', { windowMs: 60_000, max: 5 });

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new ValidationError('Invalid JSON');
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError('Invalid payload');
    }

    // Honeypot: pretend success without storing
    if (parsed.data.website && parsed.data.website.trim().length > 0) {
      return NextResponse.json({ success: true });
    }

    await messageService.createMessage({
      name: parsed.data.name,
      email: parsed.data.email,
      content: parsed.data.content,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
