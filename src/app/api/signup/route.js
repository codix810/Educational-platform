// @ts-ignore
import clientPromise from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const { name, email, password, phone, role } = await request.json();
    const createdAt = new Date();

    if (!name || !email || !password || !phone) {
      return NextResponse.json({ message: 'كل البيانات مطلوبة' }, { status: 400 });
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

    const result = await users.insertOne({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'user',
      createdAt,
    });

    const token = jwt.sign(
      {
        userId: result.insertedId,
        name,
        email,
        phone,
        role: role === 'admin' ? 'admin' : 'user',
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
        role: role === 'admin' ? 'admin' : 'user',
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
