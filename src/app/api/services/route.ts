import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { requireCsrfToken } from '@/lib/csrf';
import { handleApiError, ValidationError, InternalServerError } from '@/lib/errors';
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

const createServiceSchema = z.object({
  title: localizedTextSchema,
  description: localizedTextSchema,
  icon: z.string().min(1).max(100).optional().default('code'),
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

export async function GET(request: Request) {
  try {
    // Rate limiting: 100 requests per minute per IP
    await checkRateLimit(request, 'services:get', { windowMs: 60_000, max: 100 });

    const services = await serviceService.getAllServices();
    return NextResponse.json({ success: true, data: services });
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

    const parsed = createServiceSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError('Invalid payload', parsed.error.errors);
    }

    const newService = await serviceService.createService({
      ...parsed.data,
      icon: parsed.data.icon || 'code',
    });
    return NextResponse.json({ success: true, data: newService }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
