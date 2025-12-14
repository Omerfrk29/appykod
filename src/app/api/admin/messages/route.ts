import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import * as messageService from '@/lib/services/messageService';

export async function GET(request: Request) {
  const authRes = await requireAdmin(request);
  if (authRes) return authRes;

  try {
    const messages = await messageService.getAllMessages();
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
