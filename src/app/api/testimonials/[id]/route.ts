import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { requireCsrfToken } from '@/lib/csrf';
import { handleApiError, ValidationError, NotFoundError } from '@/lib/errors';
import * as testimonialService from '@/lib/services/testimonialService';
import { updateTestimonialSchema } from '@/lib/validations';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting: 100 requests per minute per IP
    await checkRateLimit(request, 'testimonial:get', { windowMs: 60_000, max: 100 });

    const { id } = await params;
    const testimonial = await testimonialService.getTestimonialById(id);
    if (!testimonial) {
      throw new NotFoundError('Testimonial not found');
    }
    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireCsrfToken(request);
    const authRes = await requireAdmin(request);
    if (authRes) return authRes;

    const { id } = await params;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new ValidationError('Invalid JSON');
    }

    const parsed = updateTestimonialSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError('Invalid payload', parsed.error.errors);
    }

    const updatedTestimonial = await testimonialService.updateTestimonial(id, parsed.data);
    if (!updatedTestimonial) {
      throw new NotFoundError('Testimonial not found');
    }
    return NextResponse.json({ success: true, data: updatedTestimonial });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireCsrfToken(request);
    const authRes = await requireAdmin(request);
    if (authRes) return authRes;

    const { id } = await params;
    const deleted = await testimonialService.deleteTestimonial(id);
    if (!deleted) {
      throw new NotFoundError('Testimonial not found');
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
