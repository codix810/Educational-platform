"use client";

import React from 'react';
import { BiSolidBookOpen } from "react-icons/bi";
import { FaBook, FaChalkboardTeacher, FaUsers } from "react-icons/fa";
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const advantagesData = [
  {
    count: 2000,
    label: "Graduates",
    icon: <BiSolidBookOpen size={50} className="text-[#7CA982]" />,
  },
  {
    count: 150,
    label: "Courses",
    icon: <FaBook size={50} className="text-[#7CA982]" />,
  },
  {
    count: 100,
    label: "Instructors",
    icon: <FaChalkboardTeacher size={50} className="text-[#7CA982]" />,
  },
  {
    count: 5000,
    label: "Students",
    icon: <FaUsers size={50} className="text-[#7CA982]" />,
  },
];

const Advantages = () => {
  const { ref, inView } = useInView({
    triggerOnce: true, // يشغلها مرة واحدة فقط
    threshold: 0.5, // نسبة الظهور المطلوبة لتشغيلها
  });

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
