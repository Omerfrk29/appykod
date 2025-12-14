import mongoose, { Schema, Document } from 'mongoose';

export interface LocalizedText {
  tr: string;
  en: string;
}

export interface IProject extends Document {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  imageUrl: string;
  link: string;
  fullDescription?: LocalizedText;
  technologies?: string[];
  challenges?: LocalizedText;
  solutions?: LocalizedText;
  gallery?: string[];
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

const ProjectSchema = new Schema<IProject>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: LocalizedTextSchema, required: true },
    description: { type: LocalizedTextSchema, required: true },
    imageUrl: { type: String, required: true },
    link: { type: String, default: '#' },
    fullDescription: { type: LocalizedTextSchema, required: false },
    technologies: [{ type: String }],
    challenges: { type: LocalizedTextSchema, required: false },
    solutions: { type: LocalizedTextSchema, required: false },
    gallery: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ProjectSchema.index({ id: 1 });

const ProjectModel =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default ProjectModel;
