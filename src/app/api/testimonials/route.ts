import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import * as testimonialService from '@/lib/services/testimonialService';
import { createTestimonialSchema } from '@/lib/validations';

export async function GET() {
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

  const parsed = createTestimonialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid payload', details: parsed.error.errors },
      { status: 400 }
    );
  }

  try {
    const newTestimonial = await testimonialService.createTestimonial(parsed.data);
    return NextResponse.json({ success: true, data: newTestimonial }, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}
