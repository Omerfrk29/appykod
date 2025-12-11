import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDB, saveDB } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

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
  gallery: z.array(z.string().url()).max(50).optional(),
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
    const db = await getDB();

    const service = db.services.find(s => s.id === id);

    if (!service) {
        return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(service);
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authRes = requireAdmin(request);
    if (authRes) return authRes;

    const { id } = await params;

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const parsed = updateServiceSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid payload', details: parsed.error.errors }, { status: 400 });
    }

    const db = await getDB();
    const serviceIndex = db.services.findIndex(s => s.id === id);

    if (serviceIndex === -1) {
        return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Update service with new data
    db.services[serviceIndex] = {
        ...db.services[serviceIndex],
        ...parsed.data,
    };

    await saveDB(db);

    return NextResponse.json(db.services[serviceIndex]);
}

export async function DELETE(
    request: Request, 
    { params }: { params: Promise<{ id: string }> }
) {
    const authRes = requireAdmin(request);
    if (authRes) return authRes;

    const { id } = await params;
    const db = await getDB();

    db.services = db.services.filter(s => s.id !== id);
    await saveDB(db);

    return NextResponse.json({ success: true });
}
