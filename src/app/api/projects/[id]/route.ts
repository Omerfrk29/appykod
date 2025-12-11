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

const updateProjectSchema = z.object({
  title: localizedTextSchema.optional(),
  description: localizedTextSchema.optional(),
  imageUrl: z.string().url().optional(),
  link: z.string().max(2000).optional(),
  fullDescription: localizedTextOptionalSchema.optional(),
  technologies: z.array(z.string().min(1).max(100)).max(100).optional(),
  challenges: localizedTextOptionalSchema.optional(),
  solutions: localizedTextOptionalSchema.optional(),
  gallery: z.array(z.string().url()).max(50).optional(),
});

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const db = await getDB();

    const project = db.projects.find(p => p.id === id);

    if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
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

    const parsed = updateProjectSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid payload', details: parsed.error.errors }, { status: 400 });
    }

    const db = await getDB();
    const projectIndex = db.projects.findIndex(p => p.id === id);

    if (projectIndex === -1) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Update project with new data
    db.projects[projectIndex] = {
        ...db.projects[projectIndex],
        ...parsed.data,
    };

    await saveDB(db);

    return NextResponse.json(db.projects[projectIndex]);
}

export async function DELETE(
    request: Request, 
    { params }: { params: Promise<{ id: string }> }
) {
    const authRes = requireAdmin(request);
    if (authRes) return authRes;

    const { id } = await params;
    const db = await getDB();

    db.projects = db.projects.filter(p => p.id !== id);
    await saveDB(db);

    return NextResponse.json({ success: true });
}
