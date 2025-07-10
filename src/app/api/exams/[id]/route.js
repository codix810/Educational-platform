import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// ✅ جلب امتحان معين
export async function GET(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('exams');

    const id = params.id;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const exam = await collection.findOne({ _id: new ObjectId(id) });

    if (!exam) {
      return NextResponse.json({ message: 'Exam not found' }, { status: 404 });
    }

    return NextResponse.json({ exam });
  } catch (error) {
    console.error('❌ Error in GET /api/exams/[id]:', error);
    return NextResponse.json({ message: 'Failed to fetch exam' }, { status: 500 });
  }
}

// ✅ تعديل امتحان
export async function PUT(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('exams');

    const id = params.id;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const body = await req.json();

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { questions: body.questions } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Exam not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Exam updated successfully' });
  } catch (error) {
    console.error('❌ Error in PUT /api/exams/[id]:', error);
    return NextResponse.json({ message: 'Failed to update exam' }, { status: 500 });
  }
}

// ✅ حذف امتحان
export async function DELETE(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('exams');

    const id = params.id;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Exam not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('❌ Error in DELETE /api/exams/[id]:', error);
    return NextResponse.json({ message: 'Failed to delete exam' }, { status: 500 });
  }
}
