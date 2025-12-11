import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const db = getDB();

    const project = db.projects.find(p => p.id === id);

    if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
}

export async function DELETE(
    request: Request, 
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const db = getDB();

    db.projects = db.projects.filter(p => p.id !== id);
    saveDB(db);

    return NextResponse.json({ success: true });
}
