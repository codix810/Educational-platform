import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'
export async function GET(req: NextRequest) {

  const { searchParams } = new URL(req.url);
  const instructorId = searchParams.get("instructorId");

  const client = await clientPromise;
  const db = client.db();

  const query = instructorId ? { teacherId: instructorId } : {};

  const courses = await db
    .collection('courses')
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json({ courses });

}