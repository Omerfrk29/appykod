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
    const { id } = await params;

  try {
    const service = await serviceService.getServiceById(id);
    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
  const authRes = await requireAdmin(request);
    if (authRes) return authRes;

    const { id } = await params;

    let body: unknown;
    try {
        body = await request.json();
    } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON' },
      { status: 400 }
    );
    }

    const parsed = updateServiceSchema.safeParse(body);
    if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid payload', details: parsed.error.errors },
      { status: 400 }
    );
    }

  try {
    const updatedService = await serviceService.updateService(id, parsed.data);
    if (!updatedService) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updatedService });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

export async function DELETE(
    request: Request, 
    { params }: { params: Promise<{ id: string }> }
) {
  const authRes = await requireAdmin(request);
    if (authRes) return authRes;

    const { id } = await params;

  try {
    const deleted = await serviceService.deleteService(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
