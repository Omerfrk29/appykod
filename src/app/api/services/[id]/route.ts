import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const db = getDB();
    const id = params.id;

    db.services = db.services.filter(s => s.id !== id);
    saveDB(db);

    return NextResponse.json({ success: true });
}
