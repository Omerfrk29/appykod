import connectDB from '@/lib/db/mongodb';
import TestimonialModel from '@/lib/db/models/Testimonial';
import { v4 as uuidv4 } from 'uuid';
import type { Testimonial } from '@/lib/db';

export async function getAllTestimonials(): Promise<Testimonial[]> {
  await connectDB();
  const testimonials = await TestimonialModel.find({}).lean();
  return testimonials.map((t) => ({
    id: t.id,
    name: t.name,
    role: t.role,
    content: t.content,
    imageUrl: t.imageUrl,
  }));
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  await connectDB();
  const testimonial = await TestimonialModel.findOne({ id }).lean();
  if (!testimonial) return null;
  return {
    id: testimonial.id,
    name: testimonial.name,
    role: testimonial.role,
    content: testimonial.content,
    imageUrl: testimonial.imageUrl,
  };
}

export async function createTestimonial(testimonialData: Omit<Testimonial, 'id'>): Promise<Testimonial> {
  await connectDB();
  const id = uuidv4();
  const testimonial = new TestimonialModel({
    id,
    ...testimonialData,
  });
  await testimonial.save();
  return {
    id: testimonial.id,
    name: testimonial.name,
    role: testimonial.role,
    content: testimonial.content,
    imageUrl: testimonial.imageUrl,
  };
}

export async function updateTestimonial(
  id: string,
  updateData: Partial<Omit<Testimonial, 'id'>>
): Promise<Testimonial | null> {
  await connectDB();
  const testimonial = await TestimonialModel.findOneAndUpdate(
    { id },
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();
  if (!testimonial) return null;
  return {
    id: testimonial.id,
    name: testimonial.name,
    role: testimonial.role,
    content: testimonial.content,
    imageUrl: testimonial.imageUrl,
  };
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  await connectDB();
  const result = await TestimonialModel.deleteOne({ id });
  return result.deletedCount > 0;
}

export async function getTestimonialsCount(): Promise<number> {
  await connectDB();
  return TestimonialModel.countDocuments();
}
