import { NextResponse } from 'next/server';
import { getDB, saveDB, Project } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    const db = getDB();
    return NextResponse.json(db.projects);
}

export async function POST(request: Request) {
    const body = await request.json();
    const db = getDB();

    const newProject: Project = {
        id: uuidv4(),
        ...body
    };

    db.projects.push(newProject);
    saveDB(db);

    return NextResponse.json(newProject);
}
