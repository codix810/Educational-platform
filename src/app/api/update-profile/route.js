import clientPromise from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, name, phone, image } = await req.json();
    
    if (!email) {
      return NextResponse.json({ message: 'الإيميل مطلوب لتحديث البيانات' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('houdaDB');
    const users = db.collection('users');

    const result = await users.updateOne(
      { email },
      {
        $set: {
          name,
          phone,
          image,
          
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: 'لم يتم تعديل أي بيانات' }, { status: 200 });
    }

    return NextResponse.json({ message: 'تم حفظ التعديلات بنجاح' }, { status: 200 });
  } catch (error) {
    console.error('❌ Update Profile Error:', error);
    return NextResponse.json({ message: 'حصل خطأ في السيرفر' }, { status: 500 });
  }
}
