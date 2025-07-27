// ✅ مسار: src/app/api/exams/route.js
import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

//  إنشاء امتحان جديد وربطه بكورس
export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('exams');

    const body = await req.json();
    const { courseId, title, questions } = body;

    // تحقق من صحة البيانات
    if (!courseId || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ message: 'بيانات غير صالحة' }, { status: 400 });
    }

    const exam = {
      courseId,
        title, // ✅ ضروري علشان $lookup في النتائج يشتغل
      questions: questions.map((q, index) => ({
        order: index + 1,
        question: q.question,
        options: q.options,
        answer: q.answer,
      })),
      createdAt: new Date(),
    };

    const result = await collection.insertOne(exam);
    return NextResponse.json({ message: 'تم إنشاء الامتحان بنجاح', examId: result.insertedId });
  } catch (error) {
    console.error(' Error in POST /api/exams:', error);
    return NextResponse.json({ message: 'فشل إنشاء الامتحان' }, { status: 500 });
  }
}

//  GET: جلب الامتحانات حسب الكورس
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const courseId = url.searchParams.get("courseId");

    const client = await clientPromise;
    const db = client.db();

    // لو فيه courseId نفلتر، لو مفيش نجيب الكل
    const query = courseId ? { courseId } : {};

    const exams = await db.collection("exams").find(query).toArray();

    return NextResponse.json({ exams });
  } catch (error) {
    console.error('❌ Error fetching exams:', error);
    return NextResponse.json({ error: "Error fetching exams" }, { status: 500 });
  }
}
