import clientPromise from '../../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params

  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: 'Invalid id' }), { status: 400 })
  }

  const client = await clientPromise
  const db = client.db()

  const instructor = await db.collection('users').findOne({
    _id: new ObjectId(id),
    role: 'teacher'
  })

  if (!instructor) {
    return new Response(JSON.stringify({ error: 'Instructor not found' }), { status: 404 })
  }

  const courses = await db.collection('courses').find({ teacherId: id }).toArray()

  const students = new Set<string>()

  courses.forEach((c: any) => {
    c.studentsEnrolled?.forEach((s: string) => students.add(s))
  })

  return new Response(JSON.stringify({
    id: instructor._id.toString(),
    name: instructor.name,
    email: instructor.email,
    phone: instructor.phone,
    role: instructor.role,
    bio: instructor.bio,
    image: instructor.image,
    createdAt: instructor.createdAt,
    rating: instructor.rating,
    studentsCount: students.size,
    certificatesCount: instructor.certificatesCount || 0,
    location: instructor.location,
    subject: instructor.subject
  }))
}