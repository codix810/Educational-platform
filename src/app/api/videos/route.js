import clientPromise from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();

    // التحقق من البيانات المطلوبة
const { title, url, order, duration, courseId, public_id } = body;

    if (!title || !url || !order || !courseId) {
      return NextResponse.json({ message: 'بيانات ناقصة' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('videos');




const result = await collection.insertOne({
  title,
  url,
  order: parseInt(order),
  duration,
  courseId,
  public_id, // ⚠️ إذا كنت تستخدم `publicId` في عملية الحذف، غيّره إلى `publicId`
  createdAt: new Date(),
});
    return NextResponse.json({ message: 'تم إضافة الفيديو', id: result.insertedId });
  } catch (error) {
    console.error('❌ Error in POST /api/videos:', error.message);
    return NextResponse.json({ message: 'فشل في إضافة الفيديو' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const courseId = req.nextUrl.searchParams.get('courseId');

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('videos');

    let videos = [];

    if (courseId) {
      videos = await collection
        .find({ courseId })
        .sort({ order: 1 })
        .toArray();
    } else {
      videos = await collection.find().toArray();
    }

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('❌ Error in GET /api/videos:', error.message);
    return NextResponse.json({ message: 'فشل في جلب الفيديوهات' }, { status: 500 });
  }
}
