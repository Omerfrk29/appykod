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
  updateData: Omit<Partial<SiteSettings>, 'contact' | 'social'> & {
    contact?: {
      email?: string;
      address?: Partial<SiteSettings['contact']['address']>;
    };
    social?: Partial<SiteSettings['social']>;
  }
): Promise<SiteSettings> {
  await connectDB();
  
  // Build MongoDB $set operation with nested paths to preserve existing values
  // This allows partial updates without triggering validation errors for missing required fields
  const $set: Record<string, unknown> = {};
  
  // Handle top-level fields
  if (updateData.siteName !== undefined) {
    $set['siteName'] = updateData.siteName;
  }
  if (updateData.siteDescription !== undefined) {
    $set['siteDescription'] = updateData.siteDescription;
  }
  if (updateData.logo !== undefined) {
    $set['logo'] = updateData.logo;
  }
  
  // Handle contact.email
  if (updateData.contact?.email !== undefined) {
    $set['contact.email'] = updateData.contact.email;
  }
  
  // Handle contact.address - set nested paths separately to preserve existing values
  if (updateData.contact?.address !== undefined) {
    if (updateData.contact.address.tr !== undefined) {
      $set['contact.address.tr'] = updateData.contact.address.tr;
    }
    if (updateData.contact.address.en !== undefined) {
      $set['contact.address.en'] = updateData.contact.address.en;
    }
  }
  
  // Handle social fields
  if (updateData.social !== undefined) {
    if (updateData.social.twitter !== undefined) {
      $set['social.twitter'] = updateData.social.twitter;
    }
    if (updateData.social.linkedin !== undefined) {
      $set['social.linkedin'] = updateData.social.linkedin;
    }
    if (updateData.social.instagram !== undefined) {
      $set['social.instagram'] = updateData.social.instagram;
    }
    if (updateData.social.github !== undefined) {
      $set['social.github'] = updateData.social.github;
    }
  }
  
  // Handle holidayTheme
  if (updateData.holidayTheme !== undefined) {
    if (updateData.holidayTheme.enabled !== undefined) {
      $set['holidayTheme.enabled'] = updateData.holidayTheme.enabled;
    }
  }
  
  // Use findOneAndUpdate with upsert to ensure only one settings document exists
  // Using nested paths in $set preserves existing values and avoids validation errors
  const settings = await SettingsModel.findOneAndUpdate(
    {},
    { $set },
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
