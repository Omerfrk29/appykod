import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import * as messageService from '@/lib/services/messageService';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authRes = await requireAdmin(request);
  if (authRes) return authRes;

  const { id } = await params;

  try {
    const message = await messageService.markMessageAsRead(id);
    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error('Error marking message as read:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authRes = await requireAdmin(request);
  if (authRes) return authRes;

  const { id } = await params;

  try {
    const deleted = await messageService.deleteMessage(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Message not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
