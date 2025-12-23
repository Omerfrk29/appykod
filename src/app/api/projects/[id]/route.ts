import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { requireCsrfToken } from '@/lib/csrf';
import { handleApiError, ValidationError, NotFoundError } from '@/lib/errors';
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

const updateProjectSchema = z.object({
  title: localizedTextSchema.optional(),
  description: localizedTextSchema.optional(),
  imageUrl: urlOrPathSchema.optional(),
  link: z.string().max(2000).optional(),
  fullDescription: localizedTextOptionalSchema.optional(),
  technologies: z.array(z.string().min(1).max(100)).max(100).optional(),
  challenges: localizedTextOptionalSchema.optional(),
  solutions: localizedTextOptionalSchema.optional(),
  gallery: gallerySchema,
});

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting: 100 requests per minute per IP
    await checkRateLimit(request, 'project:get', { windowMs: 60_000, max: 100 });

    const { id } = await params;
    const project = await projectService.getProjectById(id);
    if (!project) {
      throw new NotFoundError('Project not found');
    }
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireCsrfToken(request);
    const authRes = await requireAdmin(request);
    if (authRes) return authRes;

    const { id } = await params;

    let body: unknown;
    try {
        body = await request.json();
    } catch {
      throw new ValidationError('Invalid JSON');
    }

    const parsed = updateProjectSchema.safeParse(body);
    if (!parsed.success) {
      throw new ValidationError('Invalid payload', parsed.error.errors);
    }

    const updatedProject = await projectService.updateProject(id, parsed.data);
    if (!updatedProject) {
      throw new NotFoundError('Project not found');
    }
    return NextResponse.json({ success: true, data: updatedProject });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
    request: Request, 
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireCsrfToken(request);
    const authRes = await requireAdmin(request);
    if (authRes) return authRes;

    const { id } = await params;
    const deleted = await projectService.deleteProject(id);
    if (!deleted) {
      throw new NotFoundError('Project not found');
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
