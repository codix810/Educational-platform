// app/api/users/route.js
import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(); // أو db("اسم_القاعدة")
    const users = await db.collection('users').find({}).toArray();

    return NextResponse.json({ users });
  } catch (err) {
    console.error('🔥 Error in GET /api/users:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
