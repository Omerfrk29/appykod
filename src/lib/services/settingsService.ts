import connectDB from '@/lib/db/mongodb';
import SettingsModel, { ISettings } from '@/lib/db/models/Settings';
import type { SiteSettings } from '@/lib/db';

const defaultSettings: SiteSettings = {
  siteName: { tr: 'Appykod', en: 'Appykod' },
  siteDescription: { tr: 'Dijital çözümler', en: 'Digital solutions' },
  logo: '/logos/Appy_white.svg',
  contact: {
    email: 'info@appykod.com',
    address: { tr: 'İstanbul, Türkiye', en: 'Istanbul, Turkey' },
  },
  social: {},
};

export async function getSettings(): Promise<SiteSettings> {
  await connectDB();
  const settings = await SettingsModel.findOne().lean();
  if (!settings) {
    // Create default settings if none exist
    const newSettings = new SettingsModel(defaultSettings);
    await newSettings.save();
    return defaultSettings;
  }
  return {
    siteName: settings.siteName,
    siteDescription: settings.siteDescription,
    logo: settings.logo,
    contact: {
      email: settings.contact.email,
      address: settings.contact.address,
    },
    social: {
      twitter: settings.social.twitter,
      linkedin: settings.social.linkedin,
      instagram: settings.social.instagram,
      github: settings.social.github,
    },
  };
}

export async function updateSettings(
  updateData: Partial<SiteSettings>
): Promise<SiteSettings> {
  await connectDB();
  // Use findOneAndUpdate with upsert to ensure only one settings document exists
  const settings = await SettingsModel.findOneAndUpdate(
    {},
    { $set: updateData },
    { new: true, upsert: true, runValidators: true }
  ).lean();
  return {
    siteName: settings.siteName,
    siteDescription: settings.siteDescription,
    logo: settings.logo,
    contact: {
      email: settings.contact.email,
      address: settings.contact.address,
    },
    social: {
      twitter: settings.social.twitter,
      linkedin: settings.social.linkedin,
      instagram: settings.social.instagram,
      github: settings.social.github,
    },
  };
}
