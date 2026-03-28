'use client';

import { useEffect, useState } from 'react';
import { FaStar, FaUsers, FaBook } from 'react-icons/fa';
import { PiStudentFill } from 'react-icons/pi';
import { GiGraduateCap } from 'react-icons/gi';

type InstructorType = {
  _id: string;
  name: string;
  bio: string;
  image?: string;
  subject?: string;
  rating?: number;
  ratingsCount?: number;
};

type CourseType = {
  _id: string;
  title: string;
  description: string;
  price?: number;
  studentsEnrolled?: string[];
};

type ReviewType = {
  userName: string;
  rating: number;
  comment: string;
};

export default function InstructorPublicProfile({ params }: { params: Promise<{ id: string }> })
  const [instructor, setInstructor] = useState<InstructorType | null>(null);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);

  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  const user =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : null;

  // 🔥 جلب البيانات
  const fetchData = async () => {

    const instructorRes = await fetch(`/api/instructors/${params.id}`);
    const instructorData = await instructorRes.json();

    const coursesRes = await fetch(`/api/courses?instructorId=${params.id}`);
    const coursesData = await coursesRes.json();

    const purchasesRes = await fetch('/api/purchases/all');
    const purchases = await purchasesRes.json();

    const reviewsRes = await fetch(`/api/instructor/reviews?id=${params.id}`);
    const reviewsData = await reviewsRes.json();

    // حساب الطلاب
    const courseIds = coursesData.courses.map((c:any)=>c._id);
    const myStudents = purchases.filter((p:any)=>
      courseIds.includes(p.courseId)
    );

    setTotalStudents(myStudents.length);

    setInstructor(instructorData);
    setCourses(coursesData.courses || []);
    setReviews(reviewsData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  // ⭐ إرسال التقييم
  const submitReview = async () => {

    if (!user?._id) return alert('سجل دخول');

    if (!userRating) return alert('اختار تقييم');

    await fetch('/api/instructor/rate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user._id,
        instructorId: params.id,
        rating: userRating,
        comment,
      }),
    });

    setComment('');
    setUserRating(0);

    fetchData();
  };

  if (loading) return <p className="text-center p-10">Loading...</p>;
  if (!instructor) return <p className="text-center p-10">Not found</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">

      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow flex gap-6">

        <img
          src={instructor.image || '/img/default-teacher.png'}
          className="w-[140px] h-[140px] rounded-full object-cover"
        />

        <div className="space-y-3">

          <h1 className="text-2xl font-bold">{instructor.name}</h1>

          <div className="flex gap-6 text-gray-600">

            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-500"/>
              {instructor.rating?.toFixed(1) || 0}
              ({instructor.ratingsCount || 0})
            </div>

            <div className="flex items-center gap-1">
              <PiStudentFill/>
              {totalStudents} Students
            </div>

            <div className="flex items-center gap-1">
              <FaBook/>
              {courses.length} Courses
            </div>

          </div>

          <p>{instructor.bio}</p>

          <div className="flex items-center gap-2 text-gray-600">
            <GiGraduateCap/>
            {instructor.subject}
          </div>

        </div>

      </div>

      {/* COURSES */}
      <div>
        <h2 className="text-xl font-bold mb-4">Courses</h2>

        <div className="grid md:grid-cols-2 gap-4">

          {courses.map(course => (
            <div key={course._id} className="bg-white p-4 rounded shadow">

              <h3 className="font-bold">{course.title}</h3>
              <p className="text-gray-600">{course.description}</p>

              <div className="flex justify-between mt-3">

                <span className="flex items-center gap-1">
                  <FaUsers/>
                  {course.studentsEnrolled?.length || 0}
                </span>

                <button
                  className="bg-[#7CA982] text-white px-3 py-1 rounded"
                  onClick={()=> window.location.href=`/course/${course._id}`}
                >
                  شراء
                </button>

              </div>

            </div>
          ))}

        </div>
      </div>

      {/* ADD REVIEW */}
      <div className="bg-white p-6 rounded shadow space-y-4">

        <h3 className="text-lg font-bold">قيّم المدرس</h3>

        {/* نجوم */}
        <div className="flex gap-2 text-2xl">
          {[1,2,3,4,5].map(n=>(
            <FaStar
              key={n}
              onClick={()=>setUserRating(n)}
              className={`cursor-pointer ${
                n <= userRating ? 'text-yellow-500' : 'text-gray-300'
              }`}
            />
          ))}
        </div>

        {/* تعليق */}
        <textarea
          value={comment}
          onChange={(e)=>setComment(e.target.value)}
          placeholder="اكتب رأيك..."
          className="w-full border p-2 rounded"
        />

        <button
          onClick={submitReview}
          className="bg-[#7CA982] text-white px-4 py-2 rounded"
        >
          ارسال التقييم
        </button>

      </div>

      {/* REVIEWS */}
      <div className="space-y-4">

        <h3 className="text-xl font-bold">آراء الطلاب</h3>

        {reviews.map((r, i)=>(
          <div key={i} className="bg-white p-4 rounded shadow">

            <div className="flex justify-between">

              <h4 className="font-bold">{r.userName}</h4>

              <div className="flex">
                {[...Array(r.rating)].map((_,i)=>(
                  <FaStar key={i} className="text-yellow-500"/>
                ))}
              </div>

            </div>

            <p className="text-gray-600 mt-2">{r.comment}</p>

          </div>
        ))}

      </div>

    </div>
  );
}
