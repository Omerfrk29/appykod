import mongoose, { Schema, Document } from 'mongoose';

export interface LocalizedText {
  tr: string;
  en: string;
}

export interface ITestimonial extends Document {
  id: string;
  name: LocalizedText;
  role: LocalizedText;
  content: LocalizedText;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LocalizedTextSchema = new Schema<LocalizedText>(
  {
    tr: { type: String, required: true },
    en: { type: String, required: true },
  },
  { _id: false }
);

const TestimonialSchema = new Schema<ITestimonial>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: LocalizedTextSchema, required: true },
    role: { type: LocalizedTextSchema, required: true },
    content: { type: LocalizedTextSchema, required: true },
    imageUrl: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
TestimonialSchema.index({ id: 1 });

const TestimonialModel =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

export default TestimonialModel;
