import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDB, saveDB, Project } from '@/lib/db';
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

const createProjectSchema = z.object({
  title: localizedTextSchema,
  description: localizedTextSchema,
  imageUrl: z.string().url(),
  link: z.string().max(2000).optional().default('#'),
  fullDescription: localizedTextOptionalSchema.optional(),
  technologies: z.array(z.string().min(1).max(100)).max(100).optional(),
  challenges: localizedTextOptionalSchema.optional(),
  solutions: localizedTextOptionalSchema.optional(),
  gallery: z.array(z.string().url()).max(50).optional(),
});

export async function GET() {
  const db = await getDB();
  return NextResponse.json(db.projects);
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

  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.errors }, { status: 400 });
  }

  const db = await getDB();
  const newProject: Project = {
    id: uuidv4(),
    ...parsed.data,
    link: parsed.data.link || '#',
  };

  db.projects.push(newProject);
  await saveDB(db);

  return NextResponse.json(newProject);
}
