import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { handleApiError } from '@/lib/errors';
import * as settingsService from '@/lib/services/settingsService';

export async function GET(request: Request) {
  try {
    const authRes = await requireAdmin(request);
    if (authRes) return authRes;

    const settings = await settingsService.getSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return handleApiError(error);
  }
}
