import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import * as projectService from '@/lib/services/projectService';

export async function GET(request: Request) {
  const authRes = await requireAdmin(request);
  if (authRes) return authRes;

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
