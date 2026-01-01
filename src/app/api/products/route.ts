import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDB();
    return NextResponse.json({ success: true, data: db.products || [] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const product = await request.json();
    const db = await getDB();
    if (!db.products) db.products = [];

    // Generate ID if not provided
    if (!product.id) {
      product.id = `product-${Date.now()}`;
    }

    db.products.push(product);
    await saveDB(db);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
