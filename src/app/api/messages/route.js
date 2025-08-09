import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, message, userId } = body;

    if (!message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // لو userId شكل ObjectId نحوله، لو مش كده نخلي userObjectId = null
    const userObjectId = userId && ObjectId.isValid(userId) ? new ObjectId(userId) : null;

    const doc = {
      name: name || null,
      email: email || null,
      message,
      userId: userId || null,         // الحقل اللي الفرونت بيرسله (string)
      userObjectId,                   // نسخة ObjectId لو قابلة للتحويل (يسهل البحث لو خزنت سابقًا كـ ObjectId)
      createdAt: new Date(),
    };

    const result = await db.collection('messages').insertOne(doc);
    return NextResponse.json({ message: 'Message sent', id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('❌ Error saving message:', error);
    return NextResponse.json({ message: 'Failed to send message' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    console.log('🔍 GET /api/messages userId:', userId);

    const client = await clientPromise;
    const db = client.db();

    const query = {};
    if (userId) {
      const or = [{ userId }];
      if (ObjectId.isValid(userId)) or.push({ userObjectId: new ObjectId(userId) });
      query.$or = or;
    }
    console.log('🔎 Query:', query);

    const cursor = db.collection('messages').find(query).sort({ createdAt: -1 }).limit(100);
    const messages = await cursor.toArray();

    console.log('📨 Messages fetched:', messages.length);

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    return NextResponse.json({ message: 'Failed to fetch messages' }, { status: 500 });
  }
}

