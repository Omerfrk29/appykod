import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import * as projectService from '@/lib/services/projectService';
import { urlOrPathSchema, gallerySchema } from '@/lib/validations';

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
  imageUrl: urlOrPathSchema,
  link: z.string().max(2000).optional().default('#'),
  fullDescription: localizedTextOptionalSchema.optional(),
  technologies: z.array(z.string().min(1).max(100)).max(100).optional(),
  challenges: localizedTextOptionalSchema.optional(),
  solutions: localizedTextOptionalSchema.optional(),
  gallery: gallerySchema,
});

export async function GET() {
  try {
    const projects = await projectService.getAllProjects();
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
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

  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid payload', details: parsed.error.errors },
      { status: 400 }
    );
  }

  try {
    const newProject = await projectService.createProject({
    ...parsed.data,
    link: parsed.data.link || '#',
    });
    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
