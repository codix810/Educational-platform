"use client";

import React, { useState } from 'react';
import { MdAccessTime, MdOutlinePlayLesson } from "react-icons/md";
import { PiStudentFill } from "react-icons/pi";
import { FaStar, FaCircleArrowRight } from "react-icons/fa6";
import { FaStarHalfAlt } from "react-icons/fa";
import Image from 'next/image';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import cs from '../../public/img/09/course1.jpeg';
import UIUX from '../../public/img/09/UI-UX.jpg';
import Graphic from '../../public/img/09/Graphic.jpg';
import MarktingDigital from '../../public/img/09/digital.jpg';
import Art from '../../public/img/09/Art.jpeg';
import Link from 'next/link';

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

const categories = ["ALL", "Graphic", "Ui / Ux", "Digital", "Art & Craft", "Development"];

const CardCourse = () => {
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const filteredCourses =
    selectedCategory === "ALL"
      ? coursesData
      : coursesData.filter(course => course.category === selectedCategory);

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Our Upcoming Courses</h1>

        {/* Filter system */}
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

        {/* Swiper Slider */}
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
          {filteredCourses.map((course, index) => (
            <SwiperSlide key={`${course.id}-${index}`}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition">
                {/* Image */}
                <div className="bg-gray-200">
                    <Link href='/courses' className='cursor-pointer '>
                     <Image src={course.img} alt={course.title} className="w-full h-44 object-cover"/>
                    </Link>
                </div>

                {/* Details */}
                <div className="p-4">
                  <Link href='/courses' className='cursor-pointer '>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-[#7CA982]">{course.category}</span>
                    <span className="text-sm font-bold text-gray-800">{course.price}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">By {course.teacher}</p>

                  {/* Details course */}
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

                  {/* Stars and arrow */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-yellow-500">
                      <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt />
                      <div className="text-gray-800 ml-2">{course.rating}</div>
                    </div>
                    {/* <Link href='/courses' className='cursor-pointer '>
                    <FaCircleArrowRight size={30} className="text-[#7CA982] text-2xl cursor-pointer" />
                    </Link> */}
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
