import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { handleApiError } from '@/lib/errors';
import * as projectService from '@/lib/services/projectService';

export async function GET(request: Request) {
  try {
    const authRes = await requireAdmin(request);
    if (authRes) return authRes;

    const projects = await projectService.getAllProjects();
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return handleApiError(error);
  }
}
