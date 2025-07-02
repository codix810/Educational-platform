import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs'; // ✅ مضافة لتشفير الباسورد

export async function GET(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('users');

    const id = params.id;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const user = await collection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
    
  } catch (error) {
    console.error('❌ Error in GET /api/users/[id]:', error.message);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('users');

    const id = params.id;
    const body = await req.json();

    delete body._id;

    // ✅ تشفير كلمة السر فقط لو كانت موجودة ومش مشفّرة
    if (body.password && !body.password.startsWith('$2a$')) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    const result = await collection.updateOne(
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

export async function DELETE(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('users');

    const id = params.id;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('❌ Error in DELETE /api/users/[id]:', error);
    return NextResponse.json({ message: 'Delete failed' }, { status: 500 });
  }
}
