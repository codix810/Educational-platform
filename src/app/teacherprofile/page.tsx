'use client';

import { useEffect, useState } from 'react';
import {
  FaBook,
  FaRegCalendar,
  FaStar,
  FaUsers,
  FaEdit,
  FaEye,
  FaPhoneAlt,
} from 'react-icons/fa';

import { PiStudentFill } from 'react-icons/pi';
import { LiaCertificateSolid } from 'react-icons/lia';
import { MdOutlineMail } from 'react-icons/md';
import { GiGraduateCap } from 'react-icons/gi';
import { CiClock2 } from "react-icons/ci";
import { FaLocationDot } from 'react-icons/fa6';

import imageDR from '../../../public/img/instructor1.webp';

type LiveSessionType = {
  title: string;
  desc: string;
  time: string;
  cta: string;
};

type InstructorType = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  bio: string;
  image?: string;
  createdAt: string;
  rating?: number;
  studentsCount?: number;
  certificatesCount?: number;
  subject?: string;
  location?: string;
  liveSessions?: LiveSessionType[];
};

type CourseType = {
  _id: string;
  title: string;
  description: string;
  rating?: number;
  status: string;
  studentsEnrolled?: string[];
};

type CoursesResponse = {
  courses: CourseType[];
};
type PurchaseType = {
  _id: string;
  userId: string;
  courseId: string;
  price: number;
  createdAt: string;
};
export default function InstructorProfilePage() {

  const [instructor, setInstructor] = useState<InstructorType | null>(null);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {

    const fetchData = async () => {

      try {

        const userData = JSON.parse(localStorage.getItem('user') || '{}');

        if (!userData?._id) {
          throw new Error('لم يتم تسجيل الدخول');
        }

        const instructorRes = await fetch(`/api/instructors/${userData._id}`);
        const instructorData: InstructorType = await instructorRes.json();


const coursesRes = await fetch(`/api/courses?instructorId=${userData._id}`);
const coursesData: CoursesResponse = await coursesRes.json();

setCourses(coursesData.courses || []);

// جلب الطلبات
const purchasesRes = await fetch('/api/purchases/all');
const purchases: PurchaseType[] = await purchasesRes.json();

const courseIds = coursesData.courses.map(c => c._id);

const myStudents = purchases.filter((p: PurchaseType) =>
  courseIds.includes(p.courseId)
);

setTotalStudents(myStudents.length);



        setInstructor(instructorData);
        setCourses(coursesData.courses || []);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }

    };

    fetchData();

  }, []);

  if (loading) return <p className="p-6 text-center">جارِ تحميل البيانات...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;
  if (!instructor) return <p className="p-6 text-center">لا يوجد مدرس</p>;

  return (

    <div className="bg-gray-100 w-full">

      <div className="p-6 max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row gap-8 items-start bg-white shadow-md p-6 rounded-lg">

          <img
            src={instructor.image || imageDR.src}
            alt="Instructor"
            className="w-[200px] h-[200px] rounded-full object-cover"
          />

          <div className="space-y-4">

            <h1 className="text-2xl font-bold">{instructor.name}</h1>

            <div className="flex gap-4 text-sm text-gray-600">
              <span>{instructor.role || 'Instructor'}</span>
              <span className="text-green-600 font-semibold">Verified</span>
            </div>

            <p className="text-gray-700">{instructor.bio}</p>

            <div className="flex flex-wrap gap-6 text-sm text-gray-600">

              <div className="flex items-center gap-2">
                <FaRegCalendar />
                Joined {new Date(instructor.createdAt).toLocaleDateString()}
              </div>

              <div className="flex items-center gap-2">
                <FaStar />
                {instructor.rating || 4.9} Rating
              </div>

              <div className="flex items-center gap-2">
                <PiStudentFill /> {totalStudents}  Students
              </div>

            </div>

          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left */}
          <div className="lg:col-span-2 space-y-6">

            {/* Performance */}
            <div className="bg-white p-6 rounded-lg shadow-md">

              <h2 className="text-xl font-bold mb-4">
                Performance Overview
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

                <div>
                  <FaBook className="mx-auto text-blue-600 text-2xl" />
                  <h3 className="text-lg font-semibold">{courses.length}</h3>
                  <p>Total Courses</p>
                </div>

                <div>
                  <FaUsers className="mx-auto text-purple-600 text-2xl" />
<h3 className="text-lg font-semibold">
{totalStudents}
</h3>                  <p>Total Students</p>
                </div>

                <div>
                  <FaStar className="mx-auto text-yellow-500 text-2xl" />
                  <h3 className="text-lg font-semibold">{instructor.rating || 4.9}</h3>
                  <p>Avg Rating</p>
                </div>

                <div>
                  <LiaCertificateSolid className="mx-auto text-green-500 text-2xl" />
                  <h3 className="text-lg font-semibold">{instructor.certificatesCount || 0}</h3>
                  <p>Certificates</p>
                </div>

              </div>

            </div>

            {/* Courses */}
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">

              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Courses Created</h2>

                <button className="bg-[#7CA982] text-white px-4 py-2 font-bold rounded-md hover:bg-white hover:text-[#7CA982] border border-[#7CA982]">
                  + Create Course
                </button>
              </div>

              {courses.map(course => (

                <div
                  key={course._id}
                  className="bg-gray-50 p-4 rounded-md flex justify-between items-start hover:shadow"
                >

                  <div>

                    <h3 className="text-lg font-bold">
                      {course.title}
                    </h3>

                    <p className="text-sm text-gray-600">
                      {course.description}
                    </p>

                    <div className="flex gap-4 mt-2 text-sm text-gray-500">

                      <div className="flex items-center gap-1">
                        <FaUsers />
                        {course.studentsEnrolled?.length || 0} students
                      </div>

                      <div className="flex items-center gap-1">
                        <FaStar />
                        {course.rating || 4.9}
                      </div>

                      <span className={`font-semibold ${course.status === 'Active' ? 'text-green-600' : 'text-orange-500'}`}>
                        {course.status}
                      </span>

                    </div>

                  </div>

                  <div className="flex gap-2 mt-1">
                    <FaEdit className="text-[#7CA982] cursor-pointer" />
                    <FaEye className="text-[#7CA982] cursor-pointer" />
                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* Right */}
          <div className="space-y-6">

            {/* Personal */}
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">

              <h2 className="text-xl font-bold">
                Personal Information
              </h2>

              <div className="space-y-3 text-gray-700 text-sm">

                <div className="flex items-start gap-3">
                  <MdOutlineMail className="text-[#7CA982]" />
                  <div>
                    <p>Email</p>
                    <p>{instructor.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaPhoneAlt className="text-[#30c744]" />
                  <div>
                    <p>Phone</p>
                    <p>{instructor.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <GiGraduateCap className="text-purple-600" />
                  <div>
                    <p>Department</p>
                    <p>{instructor.subject}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaLocationDot className="text-[#ee4f28]" />
                  <div>
                    <p>Location</p>
                    <p>{instructor.location}</p>
                  </div>
                </div>

              </div>

            </div>

            {/* Live Sessions */}
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">

              <h2 className="text-xl font-bold">
                Upcoming Live Sessions
              </h2>

              {instructor.liveSessions?.length ? (

                instructor.liveSessions.map((session, i) => (

                  <div key={i} className="bg-gray-50 p-4 rounded-md">

                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">{session.title}</h4>
                      <span className="text-sm text-green-600">
                        {session.cta}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600">
                      {session.desc}
                    </p>

                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <CiClock2 />
                      <p>{session.time}</p>
                    </div>

                  </div>

                ))

              ) : (

                <p>لا توجد جلسات مباشرة حالياً</p>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}