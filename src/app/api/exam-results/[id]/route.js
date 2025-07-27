import clientPromise from '../../../../../lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function DELETE(req, { params }) {
  const id = params.id;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'ID غير صالح' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    // ✅ هنا بيتأكد إنه بيبحث بـ ObjectId مش String
const result = await db.collection('examResults').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'النتيجة غير موجودة' }, { status: 404 });
    }

    return NextResponse.json({ message: 'تم حذف النتيجة بنجاح' }, { status: 200 });
  } catch (error) {
    console.error('خطأ في حذف النتيجة:', error);
    return NextResponse.json({ message: 'حدث خطأ داخلي في السيرفر' }, { status: 500 });
  }
}
