import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import * as settingsService from '@/lib/services/settingsService';

export async function GET(request: Request) {
  const authRes = await requireAdmin(request);
  if (authRes) return authRes;

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
