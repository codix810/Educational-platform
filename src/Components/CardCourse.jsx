'use client';

import React, { useEffect, useState } from 'react';
import { MdAccessTime, MdOutlinePlayLesson } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from 'next/link';

const CardCourse = () => {
  const [courses, setCourses] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [videos, setVideos] = useState({});
  const [durations, setDurations] = useState({});
  const [exams, setExams] = useState({});
  const [teachers, setTeachers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [categories, setCategories] = useState(["ALL"]);

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
        const teacherData = await teacherRes.json();

        const fetchedCourses = courseData.courses || [];
        setCourses(fetchedCourses);
        setPurchases(purchaseData || []);
        setTeachers((teacherData.users || []).filter(u => u.role === 'teacher'));

        const allCategories = Array.from(new Set(fetchedCourses.map(c => c.category))).filter(Boolean);
        setCategories(["ALL", ...allCategories]);

        const videoCounts = {};
        const durationMap = {};
        const examCounts = {};

        await Promise.all(
          fetchedCourses.map(async (course) => {
            const v = await fetch(`/api/videos?courseId=${course._id}`);
            const vData = await v.json();
            const vids = vData?.videos || [];
            videoCounts[course._id] = vids.length;

            const totalDuration = vids.reduce((sum, vid) => sum + Number(vid.duration || 0), 0);
            durationMap[course._id] = totalDuration.toFixed(1);

            const e = await fetch(`/api/exams?courseId=${course._id}`);
            const eData = await e.json();
            examCounts[course._id] = eData?.exams?.length || 0;
          })
        );

        setVideos(videoCounts);
        setDurations(durationMap);
        setExams(examCounts);

      } catch (err) {
        console.error("❌ فشل تحميل البيانات:", err);
      }
    };

    fetchData();
  }, []);

  const filteredCourses =
    selectedCategory === "ALL"
      ? courses
      : courses.filter(course => course.category === selectedCategory);

  const getStudentCount = (courseId) => {
    return purchases.filter(p => String(p.courseId) === String(courseId)).length;
  };

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t._id === teacherId);
    return teacher ? teacher.name : 'مدرس غير معروف';
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">الكورسات المتاحة</h1>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full cursor-pointer border ${
                selectedCategory === cat
                  ? "bg-[#7CA982] text-white border-[#7CA982]"
                  : "bg-white text-gray-700 border-gray-300"
              } transition`}
            >
              {cat}
            </button>
          ))}
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000 }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {filteredCourses.map((course) => (
            <SwiperSlide key={course._id}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition">
                <div className="bg-gray-200">
                  <Link href={`/watch/${course._id}`}>
                    <img
                      src={course.image}
                      alt={course.title}
                      width={400}
                      height={200}
                      className="w-full h-44 object-cover"
                    />
                  </Link>
                </div>

                <div className="p-4">
                  <Link href={`/watch/${course._id}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-[#7CA982]">{course.category}</span>
                      <span className="text-sm font-bold text-gray-800">{course.price} جنيه</span>
                    </div>

                    <h3 className="text-lg font-bold mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      مدرس الكورس: {getTeacherName(course.teacherId)}
                    </p>

                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <MdAccessTime />
                        <p>{durations[course._id] || '—'} دقيقة</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <MdOutlinePlayLesson />
                        <p>{videos[course._id] || 0} دروس</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <PiStudentFill />
                        <p>+{getStudentCount(course._id)} طلاب</p>
                      </div>
                    </div>

                    <p className="text-sm text-purple-600 mb-2"> عدد الامتحانات: {exams[course._id] || 0}</p>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-yellow-500">
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt />
                        <div className="text-gray-800 ml-2">{course.rating || 4.5}</div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CardCourse;
