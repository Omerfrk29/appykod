import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
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

export async function GET() {
  try {
    const services = await serviceService.getAllServices();
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authRes = await requireAdmin(request);
  if (authRes) return authRes;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON' },
      { status: 400 }
    );
  }

  const parsed = createServiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid payload', details: parsed.error.errors },
      { status: 400 }
    );
  }

  try {
    const newService = await serviceService.createService({
    ...parsed.data,
    icon: parsed.data.icon || 'code',
    });
    return NextResponse.json({ success: true, data: newService }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
