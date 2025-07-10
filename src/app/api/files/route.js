//  المسار: src/app/api/files/route.js  ده المساول عن  اضافة وجلب الملفات
// @ts-nocheck
import clientPromise from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
const body = await req.json();

    const {
      courseId,
      title,
      url,
      type,
      sizeMB,
      originalName,
      public_id //  استقبله هنا
    } = body;

    //  تحقق من البيانات

    if (!courseId || !title || !url || !type || !sizeMB || !originalName || !public_id) {
      return NextResponse.json({ message: 'البيانات غير مكتملة' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const filesCollection = db.collection('files');

    const newFile = {
      courseId,
      title,
      url,
      type,
      sizeMB,
      originalName,
      public_id, //  خزّنه هنا
      createdAt: new Date(),
    };

    const result = await filesCollection.insertOne(newFile);

    return NextResponse.json({
      message: 'تم رفع الملف بنجاح',
      fileId: result.insertedId,
      url,
    });
  } catch (error) {
    console.error(' خطأ في رفع الملف:', error);
    return NextResponse.json({ message: 'فشل رفع الملف' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const files = await db.collection('files').find().toArray();

    return NextResponse.json({ files });
  } catch (error) {
    console.error(' Error fetching files:', error);
    return NextResponse.json({ message: 'فشل في جلب الملفات' }, { status: 500 });
  }
}

