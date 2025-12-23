import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { requireCsrfToken } from '@/lib/csrf';
import { handleApiError, ValidationError } from '@/lib/errors';
import * as testimonialService from '@/lib/services/testimonialService';
import { createTestimonialSchema } from '@/lib/validations';

export async function GET(request: Request) {
  try {
    // Rate limiting: 100 requests per minute per IP
    await checkRateLimit(request, 'testimonials:get', { windowMs: 60_000, max: 100 });

    const testimonials = await testimonialService.getAllTestimonials();
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireCsrfToken(request);
    const authRes = await requireAdmin(request);
    if (authRes) return authRes;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new ValidationError('Invalid JSON');
    }

    const parsed = createTestimonialSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError('Invalid payload', parsed.error.errors);
    }

    const newTestimonial = await testimonialService.createTestimonial(parsed.data);
    return NextResponse.json({ success: true, data: newTestimonial }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
