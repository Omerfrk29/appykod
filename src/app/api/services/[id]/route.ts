import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const db = getDB();

    const service = db.services.find(s => s.id === id);

    if (!service) {
        return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(service);
}

export async function DELETE(
    request: Request, 
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const db = getDB();

    db.services = db.services.filter(s => s.id !== id);
    saveDB(db);

    return NextResponse.json({ success: true });
}
