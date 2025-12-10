import { NextResponse } from 'next/server';
import { getDB, saveDB, Message } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    const db = getDB();
    return NextResponse.json(db.messages);
}

export async function POST(request: Request) {
    const body = await request.json();
    const db = getDB();

    const newMessage: Message = {
        id: uuidv4(),
        date: new Date().toISOString(),
        ...body
    };

    db.messages.push(newMessage);
    saveDB(db);

    return NextResponse.json({ success: true });
}
