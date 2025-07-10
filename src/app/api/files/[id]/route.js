//  المسار: src/app/api/files/[id]/route.js  ده المساول عن  تعديل و حذف الملفات
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../../lib/mongodb';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req, context) {
  const { params } = context;

  try {
    const fileId = params.id;
    const client = await clientPromise;
    const db = client.db();

    const file = await db.collection('files').findOne({ _id: new ObjectId(fileId) });

    if (!file) {
      return NextResponse.json({ message: 'الملف غير موجود' }, { status: 404 });
    }

    const public_id = file.public_id;
    const fileType = file.type === 'pdf' ? 'raw' : file.type || 'raw';

    if (!public_id) {
      return NextResponse.json({ message: 'public_id غير موجود' }, { status: 400 });
    }

    const cloudRes = await cloudinary.uploader.destroy(file.public_id, {
      resource_type: 'image', //  مهم جدًا
    });

    if (cloudRes.result !== 'ok' && cloudRes.result !== 'not_found') {
      throw new Error('فشل الحذف من Cloudinary');
    }

    await db.collection('files').deleteOne({ _id: new ObjectId(fileId) });

    return NextResponse.json({ message: 'تم الحذف بنجاح' }, { status: 200 });
  } catch (error) {
    console.error(' Delete API Error:', error.message || error);
    return NextResponse.json(
      { message: 'فشل الحذف العام', error: error.message },
      { status: 500 }
    );
  }
}

//  تعديل ملف
export async function PUT(req, { params }) {
  try {
    const id = params.id;
    const body = await req.json();

    if (!body.title || !body.sizeMB) {
      return NextResponse.json({ message: 'البيانات ناقصة' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('files').updateOne(
      { _id: new ObjectId(id) },
      { $set: { title: body.title, sizeMB: body.sizeMB } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'الملف غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ message: 'تم التحديث بنجاح' });
  } catch (error) {
    console.error(' خطأ في PUT /api/files/[id]:', error);
    return NextResponse.json({ message: 'فشل التحديث' }, { status: 500 });
  }
}

//  جلب ملف واحد
export async function GET(req, { params }) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ message: 'ID غير موجود' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const file = await db.collection('files').findOne({ _id: new ObjectId(id) });

    if (!file) {
      return NextResponse.json({ message: 'الملف غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ file });
  } catch (error) {
    console.error(' Error fetching file:', error);
    return NextResponse.json({ message: 'حدث خطأ أثناء جلب الملف', error: error.message }, { status: 500 });
  }
}
