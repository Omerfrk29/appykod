import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { requireCsrfToken } from '@/lib/csrf';
import { handleApiError, ValidationError } from '@/lib/errors';
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

export async function GET(request: Request) {
  try {
    // Rate limiting: 100 requests per minute per IP
    await checkRateLimit(request, 'projects:get', { windowMs: 60_000, max: 100 });

    const projects = await projectService.getAllProjects();
    return NextResponse.json({ success: true, data: projects });
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

    const parsed = createProjectSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError('Invalid payload', parsed.error.errors);
    }

    const newProject = await projectService.createProject({
      ...parsed.data,
      link: parsed.data.link || '#',
    });
    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
