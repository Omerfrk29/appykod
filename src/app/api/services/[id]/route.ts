import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { requireCsrfToken } from '@/lib/csrf';
import { handleApiError, ValidationError, NotFoundError } from '@/lib/errors';
import * as serviceService from '@/lib/services/serviceService';
import { gallerySchema } from '@/lib/validations';

const localizedTextSchema = z.object({
  tr: z.string().min(1).max(10000),
  en: z.string().min(1).max(10000),
});

const localizedTextOptionalSchema = z.object({
  tr: z.string().max(20000),
  en: z.string().max(20000),
});

const faqSchema = z.object({
  question: localizedTextSchema,
  answer: localizedTextSchema,
});

const updateServiceSchema = z.object({
  title: localizedTextSchema.optional(),
  description: localizedTextSchema.optional(),
  icon: z.string().min(1).max(100).optional(),
  fullDescription: localizedTextOptionalSchema.optional(),
  features: z.array(localizedTextSchema).max(100).optional(),
  gallery: gallerySchema,
  faq: z.array(faqSchema).max(100).optional(),
  pricing: z
    .object({
      startingFrom: z.string().min(1).max(50),
      currency: z.string().min(1).max(10),
    })
    .optional(),
});

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting: 100 requests per minute per IP
    await checkRateLimit(request, 'service:get', { windowMs: 60_000, max: 100 });

    const { id } = await params;
    const service = await serviceService.getServiceById(id);
    if (!service) {
      throw new NotFoundError('Service not found');
    }
    return NextResponse.json({ success: true, data: service });
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

    const parsed = updateServiceSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError('Invalid payload', parsed.error.errors);
    }

    const updatedService = await serviceService.updateService(id, parsed.data);
    if (!updatedService) {
      throw new NotFoundError('Service not found');
    }
    return NextResponse.json({ success: true, data: updatedService });
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
    const deleted = await serviceService.deleteService(id);
    if (!deleted) {
      throw new NotFoundError('Service not found');
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
