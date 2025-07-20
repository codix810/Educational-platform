import clientPromise from '../../../../lib/mongodb';

export async function POST(req) {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('examResults');

  const body = await req.json();
  const { userId, courseId, examId, answers, score } = body;

  const existing = await collection.findOne({ userId, courseId, examId });
  if (existing) {
    return new Response(JSON.stringify({ message: 'تم إرسال النتيجة من قبل' }), { status: 409 });
  }

  const result = await collection.insertOne({
    userId,
    courseId,
    examId,
    answers,
    score,
    createdAt: new Date(),
  });

  return new Response(JSON.stringify({ message: 'تم الحفظ بنجاح', result }), { status: 201 });
}

export async function GET(req) {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('examResults');

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const courseId = searchParams.get('courseId');
  const examId = searchParams.get('examId'); // أضفنا examId

  if (!userId || !courseId || !examId) {
    return new Response(JSON.stringify({ message: 'بيانات ناقصة' }), { status: 400 });
  }

  const result = await collection.findOne({ userId, courseId, examId });

  if (!result) {
    return new Response(JSON.stringify({ exists: false }), { status: 200 });
  }

  return new Response(JSON.stringify({ exists: true, result }), { status: 200 });
}
