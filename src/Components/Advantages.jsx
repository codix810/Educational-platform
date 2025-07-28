'use client';

import React, { useEffect, useState } from 'react';
import { BiSolidBookOpen } from "react-icons/bi";
import { FaBook, FaChalkboardTeacher, FaUsers } from "react-icons/fa";
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const Advantages = () => {
  const [studentsCount, setStudentsCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [teachersCount, setTeachersCount] = useState(0);
  const [graduatesCount, setGraduatesCount] = useState(0);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [purchaseRes, courseRes, userRes] = await Promise.all([
          fetch('/api/purchases/all'),
          fetch('/api/courses'),
          fetch('/api/users'),
        ]);

        const purchases = await purchaseRes.json();
        const courses = await courseRes.json();
        const users = await userRes.json();

        const students = purchases?.length || 0;
        const coursesLength = courses?.courses?.length || 0;
        const teachers = users?.users?.filter(u => u.role === 'teacher').length || 0;

        setStudentsCount(students);
        setCoursesCount(coursesLength);
        setTeachersCount(teachers);
        setGraduatesCount(Math.floor(students * 0.6)); // مثلاً 60% من الطلاب اتخرجوا
      } catch (err) {
        console.error("❌ فشل تحميل بيانات الإحصائيات:", err);
      }
    };

    fetchData();
  }, []);

  const advantagesData = [
    {
      // count: graduatesCount,
      count: 2000,
      label: "Graduates",
      icon: <BiSolidBookOpen size={50} className="text-[#7CA982]" />,
    },
    {
      // count: coursesCount,
      count: 200,
      label: "Courses",
      icon: <FaBook size={50} className="text-[#7CA982]" />,
    },
    {
      // count: teachersCount,
      count: 150,
      label: "Instructors",
      icon: <FaChalkboardTeacher size={50} className="text-[#7CA982]" />,
    },
    {
      // count: studentsCount,
      count: 5000,
      label: "Students",
      icon: <FaUsers size={50} className="text-[#7CA982]" />,
    },
  ];

  return (
    <div className="bg-white py-12" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
          {advantagesData.map((item, index) => (
            <div
              key={index}
              className="w-[250px] h-auto shadow-2xl flex flex-col items-center gap-4 py-10 rounded-lg hover:scale-105 transition"
            >
              {item.icon}
              <div className="flex flex-col items-center">
                <span className="text-xl font-extrabold">
                  +{inView ? (<CountUp end={item.count} duration={3} separator="" />) : (0)}
                </span>
                <span className="text-xl font-extrabold">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Advantages;
