import connectDB from '@/lib/db/mongodb';
import SettingsModel from '@/lib/db/models/Settings';
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
  holidayTheme: { enabled: false },
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
      email: settings.contact?.email || defaultSettings.contact.email,
      address: settings.contact?.address || defaultSettings.contact.address,
    },
    social: {
      twitter: settings.social?.twitter,
      linkedin: settings.social?.linkedin,
      instagram: settings.social?.instagram,
      github: settings.social?.github,
    },
    holidayTheme: {
      enabled: settings.holidayTheme?.enabled ?? false,
    },
  };
}

export async function updateSettings(
  updateData: Partial<SiteSettings> & {
    contact?: Partial<SiteSettings['contact']>;
    social?: Partial<SiteSettings['social']>;
  }
): Promise<SiteSettings> {
  await connectDB();
  // Use findOneAndUpdate with upsert to ensure only one settings document exists
  // MongoDB $set will merge nested objects, so partial nested updates work correctly
  const settings = await SettingsModel.findOneAndUpdate(
    {},
    { $set: updateData as Partial<SiteSettings> },
    { new: true, upsert: true, runValidators: true }
  ).lean();
  return {
    siteName: settings.siteName,
    siteDescription: settings.siteDescription,
    logo: settings.logo,
    contact: {
      email: settings.contact?.email || defaultSettings.contact.email,
      address: settings.contact?.address || defaultSettings.contact.address,
    },
    social: {
      twitter: settings.social?.twitter,
      linkedin: settings.social?.linkedin,
      instagram: settings.social?.instagram,
      github: settings.social?.github,
    },
    holidayTheme: {
      enabled: settings.holidayTheme?.enabled ?? false,
    },
  };
}
