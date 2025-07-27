import { NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(req, { params }) {
  try {
    const id = params.id;
    const client = await clientPromise;
    const db = client.db();

    // 🧾 البحث عن الشراء
    const purchase = await db.collection('purchases').findOne({ _id: new ObjectId(id) });
    if (!purchase) {
      return NextResponse.json({ message: 'عملية الشراء غير موجودة' }, { status: 404 });
    }

    const userId = purchase.userId;
    const price = parseFloat(purchase.price || 0);

    // 🗑️ حذف الشراء
    await db.collection('purchases').deleteOne({ _id: new ObjectId(id) });

    // 💰 إعادة الفلوس للمستخدم
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $inc: { balance: price } }
    );

    return NextResponse.json({ message: 'تم حذف الشراء وإرجاع الفلوس بنجاح ✅' });
  } catch (error) {
    console.error('❌ Error in DELETE /api/purchases/[id]:', error);
    return NextResponse.json({ message: 'فشل الحذف', error: error.message }, { status: 500 });
  }
}
