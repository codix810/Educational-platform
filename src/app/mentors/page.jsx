"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { PiStudentFill } from "react-icons/pi";
import { MdOutlinePlayLesson } from "react-icons/md";

// استبدل هذه الصور بالصور الحقيقية من مجلد public
import instructor1 from '../../../public/img/instructor1.webp';
import instructor2 from '../../../public/img/instructor2.webp';
import instructor3 from '../../../public/img/instructor3.jpeg';
import instructor4 from '../../../public/img/instructor4.jpeg';
import instructor5 from '../../../public/img/instructor5.jpeg';
import instructor6 from '../../../public/img/instructor6.jpeg';

const instructors = [
  {
    name: "Jouns Colar",
    specialty: "Web Developer",
    courses: 13,
    students: "12K",
    img: instructor1,
  },
  {
    name: "Ropert Fox",
    specialty: "Digital Marketing",
    courses: 10,
    students: "8K",
    img: instructor2,
  },
  {
    name: "Devon Lan",
    specialty: "UX UI Designer",
    courses: 15,
    students: "14K",
    img: instructor3,
  },
  {
    name: "Anna Smith",
    specialty: "Graphic Designer",
    courses: 9,
    students: "7K",
    img: instructor4,
  },
  {
    name: "Mike Johnson",
    specialty: "Art & Craft",
    courses: 11,
    students: "10K",
    img: instructor5,
  },
  {
    name: "Sara Lee",
    specialty: "Data Analyst",
    courses: 8,
    students: "6K",
    img: instructor6,
  },
];

const specialty = ["ALL", "Data Analyst","Graphic Designer", "UX UI Designer", "Digital", "Art & Craft", "Web Developer"];

const InstructorsPage = () => {
    const [selectedInstructor, setSelectedInstructor] = useState("ALL")
    const filterInstructor = selectedInstructor === "ALL" ? instructors :instructors.filter(instructor => instructor.specialty === selectedInstructor)
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">

        <h1 className="text-3xl font-bold text-center mb-2">Awesome Instructors</h1>
        <p className="text-center text-gray-600 mb-10">
          Provide you bright future and track your learning performance
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
            {specialty.map((instructor,index)=>(
                <button key={index}
                 onClick={()=>setSelectedInstructor(instructor)} 
                 className={`px-4 py-2 rounded-full cursor-pointer border ${selectedInstructor === instructor
                 ? "bg-[#7CA982] text-white border-[#7CA982]"  
                 : "bg-white text-gray-700 border-gray-300"} 
                 transition`}>
                    {instructor}
                </button>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filterInstructor.map((inst, index) => (
            <div key={index} className="bg-white rounded-lg cursor-pointer  shadow-lg p-6 text-center hover:scale-105 hover:shadow-2xl transition">
              <Image src={inst.img} alt={inst.name} className="w-32 h-32 mx-auto rounded-full object-cover mb-4"/>
              
              <h3 className="text-xl font-bold">{inst.name}</h3>
              <p className="text-[#7CA982] mb-2">{inst.specialty}</p>
              
              <div className="w-20 h-1 bg-[#7CA982] mx-auto mb-4"></div>

              <div className="flex justify-center gap-5 p-2 text-gray-600">
                    <div className="flex items-center gap-1">
                        <MdOutlinePlayLesson size={20}/>
                        <span>{inst.courses}</span>
                        <p>Courses</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <PiStudentFill size={20}/>
                        <span>+{inst.students}</span>
                        <p>students</p>
                    </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default InstructorsPage;
