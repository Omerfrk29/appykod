import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import * as settingsService from '@/lib/services/settingsService';
import type { SiteSettings } from '@/lib/db';

const localizedTextSchema = z.object({
  tr: z.string().max(1000),
  en: z.string().max(1000),
});

const updateSettingsSchema = z.object({
  siteName: localizedTextSchema.optional(),
  siteDescription: localizedTextSchema.optional(),
  logo: z.string().max(500).optional(),
  contact: z
    .object({
      email: z.string().email().max(100).optional(),
      address: localizedTextSchema.optional(),
    })
    .partial()
    .optional(),
  social: z
    .object({
      twitter: z.string().max(200).optional(),
      linkedin: z.string().max(200).optional(),
      instagram: z.string().max(200).optional(),
      github: z.string().max(200).optional(),
    })
    .partial()
    .optional(),
});

export async function GET() {
  try {
    const settings = await settingsService.getSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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

  const parsed = updateSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid payload', details: parsed.error.errors },
      { status: 400 }
    );
  }

  try {
    // Transform the parsed data to match Partial<SiteSettings> type
    // Handle nested partial updates for contact and social objects
    const updateData: any = { ...parsed.data };
    
    // If contact is provided, build the contact object only with defined fields
    if (parsed.data.contact) {
      const contactObj: any = {};
      if (parsed.data.contact.email !== undefined) {
        contactObj.email = parsed.data.contact.email;
      }
      if (parsed.data.contact.address !== undefined) {
        contactObj.address = parsed.data.contact.address;
      }
      // Only include contact if it has at least one field
      if (Object.keys(contactObj).length > 0) {
        updateData.contact = contactObj;
      } else {
        delete updateData.contact;
      }
    }
    
    // Use type assertion since we're handling partial nested updates
    // MongoDB $set will merge nested objects correctly
    const settings = await settingsService.updateSettings(updateData as Partial<SiteSettings>);
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

