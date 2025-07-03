import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// ✅ جلب بيانات كورس معين
export async function GET(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('courses');

    const id = params.id;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

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
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('courses');

    const id = params.id;
    const body = await req.json();

    // احذف _id لو موجود
    delete body._id;

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

// ✅ حذف كورس
export async function DELETE(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('courses');

    const id = params.id;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('❌ Error in DELETE /api/courses/[id]:', error);
    return NextResponse.json({ message: 'Delete failed' }, { status: 500 });
  }
}
