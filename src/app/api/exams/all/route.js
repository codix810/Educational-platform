import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();

  const results = await db.collection('examResults').aggregate([
    {
      $addFields: {
        userId: { $toObjectId: '$userId' },
        courseId: { $toObjectId: '$courseId' },
        examId: { $toObjectId: '$examId' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'courseId',
        foreignField: '_id',
        as: 'course'
      }
    },
    {
      $lookup: {
        from: 'exams',
        localField: 'examId',
        foreignField: '_id',
        as: 'exam'
      }
    },
    {
      $project: {
        score: 1,
        createdAt: 1,
        userName: { $arrayElemAt: ['$user.name', 0] },
        courseTitle: { $arrayElemAt: ['$course.title', 0] },
        examTitle: { $arrayElemAt: ['$exam.title', 0] },
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]).toArray();

  return new Response(JSON.stringify(results), { status: 200 });
}
