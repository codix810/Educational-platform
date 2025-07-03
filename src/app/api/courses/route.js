import clientPromise from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('courses');

    const result = await collection.insertOne(body);

    return NextResponse.json({ message: 'Course added', id: result.insertedId });
  } catch (error: any) {
    console.error('❌ Error in POST /api/courses:', error.message);
    return NextResponse.json({ message: 'Failed to add course' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const courses = await db.collection('courses').find().toArray();

    return NextResponse.json({ courses });
  } catch (error: any) {
    console.error('❌ Error in GET /api/courses:', error.message);
    return NextResponse.json({ message: 'Failed to fetch courses' }, { status: 500 });
  }
}
