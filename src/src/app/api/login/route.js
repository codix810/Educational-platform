import clientPromise from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const { email, password, deviceId } = await request.json();

    if (!email || !password || !deviceId) {
      return NextResponse.json({ message: 'كل البيانات مطلوبة' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('houdaDB');
    const users = db.collection('users');
    const sessions = db.collection('sessions');

    const user = await users.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'الحساب غير موجود' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: 'كلمة السر غير صحيحة' }, { status: 401 });
    }

    // ✅ تحديث عداد الدخول وتاريخ آخر دخول
const now = new Date();

await users.updateOne(
  { _id: user._id },
  {
    $inc: { loginCount: 1 },
    $set: { lastLogin: now },
    $push: {
      loginHistory: {
        $each: [now.toISOString().split('T')[0]],
        $position: 0
      }
    }
  }
);

    // ✅ إنشاء JWT
    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role || 'user',
        lastLogin: now.toISOString(), 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ تأكد هل الجلسة موجودة بنفس deviceId
    const existingSession = await sessions.findOne({
      userId: new ObjectId(user._id),
      deviceId: deviceId,
    });

    if (!existingSession) {
      console.log('📌 تسجيل جلسة جديدة للجهاز:', deviceId);
await sessions.insertOne({
  userId: new ObjectId(user._id),
  deviceId,
  token,
  userAgent: request.headers.get('user-agent') || 'unknown',
  createdAt: new Date(),
  lastLogin: now.toISOString(), // ✅ التعديل الصح
  isActive: true
});

    } else {
      console.log('✅ الجلسة موجودة بالفعل للجهاز:', deviceId);
    }

    // ✅ إعداد الكوكي
    const response = NextResponse.json({
      message: 'تم تسجيل الدخول بنجاح',
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role || 'user',
          image: user.image || null,
        }

    }, { status: 200 });

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('❌ Login Error:', error);
    return NextResponse.json({ message: 'حصل خطأ في السيرفر', error: error.message }, { status: 500 });
  }
}
