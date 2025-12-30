import mongoose, { Schema, Document } from 'mongoose';

export interface LocalizedText {
  tr: string;
  en: string;
}

export interface ISettings extends Document {
  siteName: LocalizedText;
  siteDescription: LocalizedText;
  logo: string;
  contact: {
    email: string;
    address: LocalizedText;
  };
  social: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    github?: string;
  };
  holidayTheme?: {
    enabled: boolean;
  };
  sessionSecret?: string;
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

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: { type: LocalizedTextSchema, required: true },
    siteDescription: { type: LocalizedTextSchema, required: true },
    logo: { type: String, required: true },
    contact: {
      email: { type: String, required: true },
      address: { type: LocalizedTextSchema, required: true },
    },
    social: {
      twitter: { type: String, required: false },
      linkedin: { type: String, required: false },
      instagram: { type: String, required: false },
      github: { type: String, required: false },
    },
    holidayTheme: {
      enabled: { type: Boolean, default: false },
    },
    sessionSecret: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

// Singleton pattern - only one settings document
SettingsSchema.index({}, { unique: true });

const SettingsModel =
  mongoose.models.Settings ||
  mongoose.model<ISettings>('Settings', SettingsSchema);

export default SettingsModel;
