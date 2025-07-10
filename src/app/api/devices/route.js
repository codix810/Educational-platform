import clientPromise from '../../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('houdaDB');

    const users = await db.collection('users').find().toArray();

    const sessions = await db.collection('sessions').aggregate([
      {
        $group: {
          _id: {
            userId: '$userId',
            deviceId: '$deviceId',
          },
          lastUsed: { $max: '$createdAt' },
          userAgent: { $first: '$userAgent' }
        }
      }
    ]).toArray();

    const grouped = users.map((user) => {
      const devices = sessions
        .filter((s) => s._id.userId.toString() === user._id.toString())
        .map((s, index) => ({
          index: index + 1,
          deviceId: s._id.deviceId,
          userAgent: s.userAgent,
          lastUsed: new Date(s.lastUsed).toLocaleString(),
        }));

      return {
        email: user.email,
        devices,
      };
    });

    return NextResponse.json({ data: grouped }, { status: 200 });
  } catch (err) {
    console.error('❌ Error:', err);
    return NextResponse.json({ message: 'خطأ في السيرفر' }, { status: 500 });
  }
}