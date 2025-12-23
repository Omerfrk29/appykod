import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { handleApiError } from '@/lib/errors';
import * as testimonialService from '@/lib/services/testimonialService';

export async function GET(request: Request) {
  try {
    const authRes = await requireAdmin(request);
    if (authRes) return authRes;

    const testimonials = await testimonialService.getAllTestimonials();
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    return handleApiError(error);
  }
}
