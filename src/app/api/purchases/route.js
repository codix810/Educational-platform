//src\app\api\purchases\route.js
import clientPromise from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// ✅ POST: تسجيل عملية شراء جديدة
export async function POST(req) {
  try {
    const { userId, courseId, price } = await req.json();

    const client = await clientPromise;
    const db = client.db();

    // 🧠 تحديث رصيد المستخدم أولاً
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ message: 'المستخدم غير موجود' }, { status: 404 });
    }

    if (user.balance < price) {
      return NextResponse.json({ message: 'الرصيد غير كافي' }, { status: 400 });
    }

    // 🛍️ تسجيل عملية الشراء
    await db.collection('purchases').insertOne({
      userId: new ObjectId(userId),
      courseId: new ObjectId(courseId),
      price,
      createdAt: new Date()
    });

    // 💰 خصم السعر من الرصيد
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $inc: { balance: -price } }
    );

    return NextResponse.json({ message: 'تمت عملية الشراء بنجاح' }, { status: 200 });

  } catch (err) {
    console.error('❌ Error in POST /api/purchases:', err.message);
    return NextResponse.json({ message: 'حدث خطأ في عملية الشراء' }, { status: 500 });
  }
}

// ✅ POST: التأكد من أن المستخدم اشترى الكورس مسبقاً
export async function PUT(req) {
  try {
    const { userId, courseId } = await req.json();

    const client = await clientPromise;
    const db = client.db();

    const exists = await db.collection('purchases').findOne({
      userId: new ObjectId(userId),
      courseId: new ObjectId(courseId)
    });

    return NextResponse.json({ exists: !!exists }, { status: 200 });

  } catch (err) {
    console.error('❌ Error in PUT /api/purchases:', err.message);
    return NextResponse.json({ message: 'فشل التحقق' }, { status: 500 });
  }
}
// ✅ GET: جلب كل الكورسات المشترية لمستخدم معين
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'userId مطلوب' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const purchases = await db
      .collection('purchases')
      .find({ userId: new ObjectId(userId) })
      .toArray();

    return NextResponse.json(purchases, { status: 200 });
  } catch (err) {
    console.error('❌ Error in GET /api/purchases:', err.message);
    return NextResponse.json({ message: 'فشل في جلب الكورسات المشترية' }, { status: 500 });
  }
}
