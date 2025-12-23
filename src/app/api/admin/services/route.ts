import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { handleApiError } from '@/lib/errors';
import * as serviceService from '@/lib/services/serviceService';

export async function GET(request: Request) {
  try {
    const authRes = await requireAdmin(request);
    if (authRes) return authRes;

    const services = await serviceService.getAllServices();
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    return handleApiError(error);
  }
}
