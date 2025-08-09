'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdAccessTime, MdOutlinePlayLesson } from 'react-icons/md';
import { PiStudentFill } from 'react-icons/pi';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

const PopularCourses = () => {
  const [courses, setCourses] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [videos, setVideos] = useState({});
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, purchaseRes, teacherRes] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/purchases/all'),
          fetch('/api/users'),
        ]);

        const courseData = await courseRes.json();
        const purchaseData = await purchaseRes.json();
        const fetchedCourses = courseData.courses || [];
        const teacherData = await teacherRes.json();

        setCourses(fetchedCourses);
        setPurchases(purchaseData || []);
                setTeachers((teacherData.users || []).filter(u => u.role === 'teacher'));

        const videoCounts = {};
        await Promise.all(
          fetchedCourses.map(async (course) => {
            const v = await fetch(`/api/videos?courseId=${course._id}`);
            const vData = await v.json();
            const vids = vData?.videos || [];
            videoCounts[course._id] = vids.length;
          })
        );

        setVideos(videoCounts);
      } catch (err) {
        console.error("❌ فشل تحميل البيانات:", err);
      }
    };

    fetchData();
  }, []);

  const getStudentCount = (courseId) => {
    return purchases.filter(p => String(p.courseId) === String(courseId)).length;
  };

  const topCourses = [...courses]
    .sort((a, b) => {
      const scoreA = getStudentCount(a._id) + (videos[a._id] || 0);
      const scoreB = getStudentCount(b._id) + (videos[b._id] || 0);
      return scoreB - scoreA;
    })
    .slice(0, 5);
  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t._id === teacherId);
    return teacher ? teacher.name : 'مدرس غير معروف';
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-10">Top 5 Popular Courses</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {topCourses.map((course) => (
            <Link href={`/courses`} key={course._id}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition cursor-pointer">
                <div className="bg-gray-200">
                  <img
                    src={course.image || '/uploads/default.png'}
                    alt={course.title}
                    className="w-full h-44 object-cover"
                  />
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-[#7CA982]">{course.category}</span>
                    <span className="text-sm font-bold text-gray-800">{course.price} EGP</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4"> 
                   Instructor: {getTeacherName(course.teacherId)}
                  </p>

                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <MdOutlinePlayLesson />
                      <p>{videos[course._id] || 0} Lessons</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <PiStudentFill />
                      <p>+{getStudentCount(course._id)} students</p>
                    </div>
                  </div>

                  <div className="flex items-center text-yellow-500">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt />
                    <div className="text-gray-800 ml-2">{course.rating || 4.5}</div>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularCourses;
