import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDB, saveDB, Service } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

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
  gallery: z.array(z.string().url()).max(50).optional(),
  faq: z.array(faqSchema).max(100).optional(),
  pricing: z
    .object({
      startingFrom: z.string().min(1).max(50),
      currency: z.string().min(1).max(10),
    })
    .optional(),
});

export async function GET() {
  const db = await getDB();
  return NextResponse.json(db.services);
}

export async function POST(request: Request) {
  const authRes = requireAdmin(request);
  if (authRes) return authRes;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = createServiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.errors }, { status: 400 });
  }

  const db = await getDB();
  const newService: Service = {
    id: uuidv4(),
    ...parsed.data,
    icon: parsed.data.icon || 'code',
  };

  db.services.push(newService);
  await saveDB(db);

  return NextResponse.json(newService);
}
