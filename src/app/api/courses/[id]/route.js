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

// ✅ جلب كورس معين
export async function GET(req, { params }) {
  try {
    const id = params.id;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('courses');

    const course = await collection.findOne({ _id: new ObjectId(id) });

    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('❌ Error in GET /api/courses/[id]:', error.message);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// ✅ تعديل كورس
export async function PUT(req, { params }) {
  try {
    const id = params.id;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const body = await req.json();
    delete body._id; // إزالة _id لو موجودة

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('courses');

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Course updated successfully' });
  } catch (error) {
    console.error('❌ Error in PUT /api/courses/[id]:', error);
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}

// ✅ حذف كورس (مع حذف الصورة من Cloudinary)
export async function DELETE(req, { params }) {
  try {
    const id = params.id;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('courses');

    const course = await collection.findOne({ _id: new ObjectId(id) });
    if (!course) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    // حذف الصورة من Cloudinary لو فيه public_id
    if (course.public_id) {
      const cloudRes = await cloudinary.uploader.destroy(course.public_id, {
        resource_type: 'image',
      });

      if (cloudRes.result === 'ok' || cloudRes.result === 'not_found') {
        console.log('✅ صورة محذوفة من Cloudinary:', course.public_id);
      } else {
        console.warn('⚠️ لم يتم حذف الصورة من Cloudinary:', cloudRes);
      }
    }

    const deleteResult = await collection.deleteOne({ _id: new ObjectId(id) });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Course and image deleted successfully ✅' });
  } catch (error) {
    console.error('❌ Error in DELETE /api/courses/[id]:', error);
    return NextResponse.json({ message: 'Delete failed', error: error.message }, { status: 500 });
  }
}
