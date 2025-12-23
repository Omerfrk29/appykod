import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { requireCsrfToken } from '@/lib/csrf';
import { handleApiError, NotFoundError } from '@/lib/errors';
import * as messageService from '@/lib/services/messageService';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireCsrfToken(request);
    const authRes = await requireAdmin(request);
    if (authRes) return authRes;

    const { id } = await params;
    const message = await messageService.markMessageAsRead(id);
    if (!message) {
      throw new NotFoundError('Message not found');
    }
    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireCsrfToken(request);
    const authRes = await requireAdmin(request);
    if (authRes) return authRes;

    const { id } = await params;
    const deleted = await messageService.deleteMessage(id);
    if (!deleted) {
      throw new NotFoundError('Message not found');
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
