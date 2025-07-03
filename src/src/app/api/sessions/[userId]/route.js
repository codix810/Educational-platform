import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('houdaDB');
    const sessions = db.collection('sessions');

    const userId = params.userId;

    const devices = await sessions
      .aggregate([
        { $match: { userId: new ObjectId(userId) } },
        {
          $group: {
            _id: '$deviceId',
            lastUsed: { $max: '$createdAt' },
            userAgent: { $first: '$userAgent' }
          }
        },
        { $sort: { lastUsed: -1 } }
      ])
      .toArray();

    return NextResponse.json({ devices }, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching sessions:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
