import clientPromise from '../../../../../lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const purchases = await db.collection('purchases').aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'courseId',
          foreignField: '_id',
          as: 'course',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $unwind: '$course',
      },
      {
        $project: {
          _id: 1,
          price: 1,
          createdAt: 1,
          userName: '$user.name',
          courseTitle: '$course.title',
          coursePrice: '$course.price',
        },
      },
    ]).toArray();

    return NextResponse.json(purchases, { status: 200 });
  } catch (err) {
    console.error('❌ Error in GET /api/purchases/full:', err.message);
    return NextResponse.json({ message: 'فشل في جلب المشتريات الكاملة' }, { status: 500 });
  }
}
