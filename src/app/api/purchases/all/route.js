import clientPromise from '../../../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const purchases = await db.collection('purchases').find().toArray();

    return NextResponse.json(purchases, { status: 200 });
  } catch (err) {
    console.error('❌ Error in GET /api/purchases/all:', err.message);
    return NextResponse.json({ message: 'فشل في جلب المشتريات' }, { status: 500 });
  }
}
