import mongoose, { Schema, Document } from 'mongoose';

export interface LocalizedText {
  tr: string;
  en: string;
}

export interface FAQ {
  question: LocalizedText;
  answer: LocalizedText;
}

export interface Pricing {
  startingFrom: string;
  currency: string;
}

export interface IService extends Document {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  icon: string;
  fullDescription?: LocalizedText;
  features?: LocalizedText[];
  gallery?: string[];
  faq?: FAQ[];
  pricing?: Pricing;
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

const FAQSchema = new Schema<FAQ>(
  {
    question: { type: LocalizedTextSchema, required: true },
    answer: { type: LocalizedTextSchema, required: true },
  },
  { _id: false }
);

const PricingSchema = new Schema<Pricing>(
  {
    startingFrom: { type: String, required: true },
    currency: { type: String, required: true },
  },
  { _id: false }
);

const ServiceSchema = new Schema<IService>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: LocalizedTextSchema, required: true },
    description: { type: LocalizedTextSchema, required: true },
    icon: { type: String, default: 'code' },
    fullDescription: { type: LocalizedTextSchema, required: false },
    features: [{ type: LocalizedTextSchema }],
    gallery: [{ type: String }],
    faq: [{ type: FAQSchema }],
    pricing: { type: PricingSchema, required: false },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ServiceSchema.index({ id: 1 });

const ServiceModel =
  mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);

export default ServiceModel;
