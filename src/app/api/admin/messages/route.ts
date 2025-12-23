import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { handleApiError } from '@/lib/errors';
import * as messageService from '@/lib/services/messageService';

export async function GET(request: Request) {
  try {
    const authRes = await requireAdmin(request);
    if (authRes) return authRes;

    const messages = await messageService.getAllMessages();
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    return handleApiError(error);
  }
}
