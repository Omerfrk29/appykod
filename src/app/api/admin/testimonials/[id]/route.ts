import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import * as testimonialService from '@/lib/services/testimonialService';
import { updateTestimonialSchema } from '@/lib/validations';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authRes = await requireAdmin(request);
  if (authRes) return authRes;

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON' },
      { status: 400 }
    );
  }

  const parsed = updateTestimonialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid payload', details: parsed.error.errors },
      { status: 400 }
    );
  }

  try {
    const updatedTestimonial = await testimonialService.updateTestimonial(id, parsed.data);
    if (!updatedTestimonial) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updatedTestimonial });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authRes = await requireAdmin(request);
  if (authRes) return authRes;

  const { id } = await params;

  try {
    const deleted = await testimonialService.deleteTestimonial(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}
