import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import * as testimonialService from '@/lib/services/testimonialService';

export async function GET(request: Request) {
  const authRes = await requireAdmin(request);
  if (authRes) return authRes;

  try {
    const testimonials = await testimonialService.getAllTestimonials();
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}
