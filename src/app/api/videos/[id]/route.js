
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../../../lib/mongodb';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// ⚙️ إعداد Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req, { params }) {
  try {
    const id = params.id;
    const client = await clientPromise;
    const db = client.db();
    const videos = db.collection('videos');

    // 🧱 1. الحصول على الفيديو
    const video = await videos.findOne({ _id: new ObjectId(id) });
    if (!video) {
      return NextResponse.json({ message: 'الفيديو غير موجود' }, { status: 404 });
    }

    const public_id = video.public_id;
    if (!public_id) {
      return NextResponse.json({ message: 'لا يوجد معرف Cloudinary', error: true }, { status: 400 });
    }

    // 🧨 2. حذف الفيديو من Cloudinary
    const cloudRes = await cloudinary.uploader.destroy(public_id, {
      resource_type: 'video',
    });

    if (cloudRes.result !== 'ok') {
      return NextResponse.json({ message: 'فشل حذف الفيديو من Cloudinary', cloudRes }, { status: 500 });
    }

    // 🧹 3. حذف الفيديو من MongoDB
    await videos.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: 'تم حذف الفيديو من Cloudinary و MongoDB بنجاح ✅' });
  } catch (error) {
    console.error('❌ Error in DELETE /api/videos/[id]:', error);
    return NextResponse.json({ message: 'فشل الحذف العام', error: error.message }, { status: 500 });
  }
}
// ✅ جلب فيديو واحد بـ id
export async function GET(req, { params }) {
  
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ message: 'ID غير موجود' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const videos = db.collection('videos');

    const video = await videos.findOne({ _id: new ObjectId(id) });

    if (!video) {
      return NextResponse.json({ message: 'الفيديو غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ video }); // ✅ لازم يكون جوه object اسمه video
  } catch (error) {
    console.error('❌ Error fetching video:', error);
    return NextResponse.json({ message: 'حدث خطأ أثناء جلب الفيديو', error: error.message }, { status: 500 });
  }
}

// ✅ تعديل فيديو
export async function PUT(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('videos');

    const id = params.id;
    const body = await req.json();
    delete body._id;

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Video updated successfully' });
  } catch (error) {
    console.error('❌ Error in PUT /api/videos/[id]:', error);
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}
