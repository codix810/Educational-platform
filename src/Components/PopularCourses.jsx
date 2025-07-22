"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MdAccessTime, MdOutlinePlayLesson } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import cs from '../../public/img/09/course1.jpeg';
import UIUX from '../../public/img/09/UI-UX.jpg';
import Graphic from '../../public/img/09/Graphic.jpg';
import MarktingDigital from '../../public/img/09/digital.jpg';
import Art from '../../public/img/09/Art.jpeg';

const coursesData = [
  {
    id: 1,
    category: "Ui / Ux",
    title: "Become a UX / UI Designer Professional.",
    teacher: "Dr. Malek Omar",
    duration: "5hr 30min",
    lessons: 13,
    img: UIUX,
    students: "3.5k",
    price: "$299",
    rating: 4.9,
  },
  {
    id: 2,
    category: "Graphic",
    title: "Master Graphic Design in 2025.",
    teacher: "Dr. Sarah Ali",
    duration: "6hr 10min",
    lessons: 15,
    img: Graphic,
    students: "4k",
    price: "$349",
    rating: 4.8,
  },
  {
    id: 3,
    category: "Development",
    title: "Full Stack Web Developer Bootcamp.",
    teacher: "Dr. Ahmed Nabil",
    duration: "8hr 45min",
    lessons: 20,
    img: cs,
    students: "5k",
    price: "$499",
    rating: 4.7,
  },
  {
    id: 4,
    category: "Digital",
    title: "Digital Marketing Masterclass",
    teacher: "Dr. Ahmed Nabil",
    duration: "10hr",
    lessons: 25,
    img: MarktingDigital,
    students: "6k",
    price: "$599",
    rating: 4.9,
  },
  {
    id: 5,
    category: "Art & Craft",
    title: "Advanced Art & Craft Course.",
    teacher: "Dr. Rana Salem",
    duration: "4hr",
    lessons: 12,
    img: Art,
    students: "3k",
    price: "$399",
    rating: 4.8,
  },
];

const PopularCourses = () => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        
        <h1 className="text-3xl font-bold text-center mb-10">Our Popular Courses</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {coursesData.map((course) => (
            <Link href="/courses" key={course.id}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition cursor-pointer">
                
                {/* Image */}
                <div className="bg-gray-200">
                  <Image src={course.img} alt={course.title} className="w-full h-44 object-cover"/>
                </div>

                {/* Details */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-[#7CA982]">{course.category}</span>
                    <span className="text-sm font-bold text-gray-800">{course.price}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">By {course.teacher}</p>

                  {/* Course details */}
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <MdAccessTime />
                      <p>{course.duration}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <MdOutlinePlayLesson />
                      <p>{course.lessons} lessons</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <PiStudentFill />
                      <p>+{course.students} students</p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center text-yellow-500">
                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt />
                    <div className="text-gray-800 ml-2">{course.rating}</div>
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
