import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import * as serviceService from '@/lib/services/serviceService';

export async function GET(request: Request) {
  const authRes = await requireAdmin(request);
  if (authRes) return authRes;

  try {
    const services = await serviceService.getAllServices();
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}
