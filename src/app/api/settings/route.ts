import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDB, saveDB } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

const localizedTextSchema = z.object({
  tr: z.string().max(1000),
  en: z.string().max(1000),
});

const updateSettingsSchema = z.object({
  siteName: localizedTextSchema.optional(),
  siteDescription: localizedTextSchema.optional(),
  logo: z.string().max(500).optional(),
  contact: z.object({
    phone: z.string().max(50).optional(),
    email: z.string().email().max(100).optional(),
    address: localizedTextSchema.optional(),
  }).optional(),
  social: z.object({
    twitter: z.string().max(200).optional(),
    linkedin: z.string().max(200).optional(),
    instagram: z.string().max(200).optional(),
    github: z.string().max(200).optional(),
  }).optional(),
});

export async function GET() {
  const db = await getDB();
  return NextResponse.json(db.settings || {});
}

export async function PUT(request: Request) {
  const authRes = requireAdmin(request);
  if (authRes) return authRes;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = updateSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.errors }, { status: 400 });
  }

  const db = await getDB();
  
  // Deep merge settings
  db.settings = {
    ...db.settings,
    ...parsed.data,
    contact: {
      ...db.settings?.contact,
      ...parsed.data.contact,
    },
    social: {
      ...db.settings?.social,
      ...parsed.data.social,
    },
  } as typeof db.settings;

  await saveDB(db);

  return NextResponse.json(db.settings);
}

