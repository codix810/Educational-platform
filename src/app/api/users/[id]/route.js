import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// --- دالة الحصول على بيانات مستخدم ---
export async function GET(req, { params }) {
  try {
    const { id } = await params; // ✅ تصحيح: إضافة await للـ params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('❌ Error in GET /api/users/[id]:', error.message);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// --- دالة تحديث بيانات مستخدم كاملة ---
export async function PUT(req, { params }) {
  try {
    const { id } = await params; // ✅ تصحيح: إضافة await للـ params
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db();

    delete body._id;

    if (body.password && !body.password.startsWith('$2a$')) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('❌ Error in PUT /api/users/[id]:', error);
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}

// --- دالة حذف مستخدم ---
export async function DELETE(req, { params }) {
  try {
    const { id } = await params; // ✅ تصحيح: إضافة await للـ params
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('❌ Error in DELETE /api/users/[id]:', error);
    return NextResponse.json({ message: 'Delete failed' }, { status: 500 });
  }
}

// --- دالة تحديث جزئي (الرصيد أو الكورسات) ---
export async function PATCH(req, { params }) {
  try {
    const { id } = await params; // ✅ تصحيح: إضافة await للـ params
    const body = await req.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const updateFields = {};
    if (body.balance !== undefined) updateFields.balance = body.balance;
    if (body.purchasedCourses !== undefined) updateFields.purchasedCourses = body.purchasedCourses;

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('❌ Error in PATCH /api/users/[id]:', error);
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}