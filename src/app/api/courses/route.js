import clientPromise from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('courses');


const result = await collection.insertOne({
  title: body.title,
  price: body.price,
  description: body.description,
  image: body.image,
  public_id: body.public_id,
  teacherId: body.teacherId,
  category: body.category || 'General',
  createdAt: new Date(),
});

    return NextResponse.json({ message: 'Course added', id: result.insertedId });
  } catch (error) {
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
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to fetch courses' }, { status: 500 });
  }
}
