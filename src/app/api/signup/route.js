import clientPromise from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const {
      name,
      email,
      password,
      phone,
      role,
      image,       // 🆕 صورة المدرس
      subject,     // 🆕 تخصص المدرس
      experience   // 🆕 عدد سنوات الخبرة
    } = await request.json();

    const createdAt = new Date();

    if (!name || !email || !password || !phone || !role) {
      return NextResponse.json({ message: 'كل البيانات مطلوبة' }, { status: 400 });
    }

    // لو مدرس لازم يكون رافع صورة وكاتب التخصص والخبرة
    if (role === 'teacher') {
      if (!image || !subject || !experience) {
        return NextResponse.json({ message: 'برجاء إدخال جميع بيانات المدرس' }, { status: 400 });
      }
    }

    const client = await clientPromise;
    const db = client.db('houdaDB');
    const users = db.collection('users');

    const exists = await users.findOne({
      $or: [{ email }, { phone }]
    });

    if (exists) {
      return NextResponse.json({ message: 'الإيميل أو رقم الهاتف موجود بالفعل' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email,
      phone,
      password: hashedPassword,
      role: ['admin', 'teacher'].includes(role) ? role : 'user',
      createdAt,
    };

    // لو مدرس نضيف البيانات الإضافية
    if (role === 'teacher') {
      userData.image = image;
      userData.subject = subject;
      userData.experience = experience;
    }

    const result = await users.insertOne(userData);

    const token = jwt.sign(
      {
        userId: result.insertedId,
        name,
        email,
        phone,
        role: userData.role,
        createdAt,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      message: 'تم إنشاء الحساب بنجاح 🎉',
      user: {
        _id: result.insertedId,
        name,
        email,
        phone,
        role: userData.role,
        createdAt,
      }
    }, { status: 201 });

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('❌ MongoDB Error:', error);
    return NextResponse.json({ message: 'حصل خطأ في السيرفر', error: error.message }, { status: 500 });
  }
}
