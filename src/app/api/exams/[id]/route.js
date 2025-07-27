import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

// ✅ جلب بيانات
export async function GET(req, { params }) {
  const id = params.id;

  const client = await clientPromise;
  const db = client.db();

  // ✅ حالة: جلب الكورسات اللي مفيهاش امتحانات
  if (id === 'no-exam') {
    const coursesWithExams = await db.collection('exams').distinct('courseId');
    const courses = await db.collection('courses')
      .find({ _id: { $nin: coursesWithExams.map(id => new ObjectId(id)) } })
      .toArray();

    return NextResponse.json(courses, { status: 200 });
  }

  // ✅ حالة: جلب امتحان محدد
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
  }

  const exam = await db.collection('exams').findOne({ _id: new ObjectId(id) });

  if (!exam) {
    return NextResponse.json({ message: 'Exam not found' }, { status: 404 });
  }

  return NextResponse.json({ exam });
}

// ✅ تعديل امتحان
export async function PUT(req, { params }) {
  const id = params.id;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const body = await req.json();

  const result = await db.collection('exams').updateOne(
    { _id: new ObjectId(id) },
    { $set: { questions: body.questions, title: body.title } }

  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ message: 'Exam not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Exam updated successfully' });
}

// ✅ حذف امتحان
export async function DELETE(req, { params }) {
  const id = params.id;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();

  const result = await db.collection('exams').deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return NextResponse.json({ message: 'Exam not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Exam deleted successfully' });
}
