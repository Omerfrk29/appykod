import { NextResponse } from 'next/server';
import { getDB, saveDB, Service } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    const db = getDB();
    return NextResponse.json(db.services);
}

export async function POST(request: Request) {
    const body = await request.json();
    const db = getDB();

    const newService: Service = {
        id: uuidv4(),
        ...body
    };

    db.services.push(newService);
    saveDB(db);

    return NextResponse.json(newService);
}
