"use client";

import Image from 'next/image';
import React from 'react';
import { 
  FaBook, FaRegCalendar, FaStar, FaUsers, FaEdit, FaEye, FaPhoneAlt 
} from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { LiaCertificateSolid } from "react-icons/lia";
import { MdOutlineMail } from "react-icons/md";
import { GiGraduateCap } from "react-icons/gi";
import { CiClock2 } from "react-icons/ci";
import { FaLocationDot } from "react-icons/fa6";
import imageDR from '../../../public/img/instructor1.webp'

const InstructorProfilePage = () => {
  return (
    <div className='bg-gray-100 w-full'>
        <div className="p-6 max-w-7xl mx-auto space-y-10 ">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 items-start bg-white shadow-md p-6 rounded-lg">
            <Image src={imageDR} width={200} height={150} className="rounded-full object-cover" alt="Instructor" />

            <div className="space-y-4">
            <h1 className="text-2xl font-bold">Dr. Eman Mohammed</h1>
            <div className="flex gap-4 text-sm text-gray-600">
                <span>Senior Instructor</span>
                <span className="text-green-600 font-semibold">Verified</span>
            </div>
            <p className="text-gray-700">
                Passionate educator with 10+ years of experience in Computer Science and Machine Learning.
                Dedicated to making complex concepts accessible to all students.
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2"><FaRegCalendar /> Joined March 2020</div>
                <div className="flex items-center gap-2"><FaStar /> 4.9 Rating</div>
                <div className="flex items-center gap-2"><PiStudentFill /> 2,847 Students</div>
            </div>
            </div>
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Section */}
            <div className="lg:col-span-2 space-y-6">
            {/* Performance Overview */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Performance Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                    <FaBook className="mx-auto text-blue-600 text-2xl" />
                    <h3 className="text-lg font-semibold">12</h3>
                    <p>Total Courses</p>
                </div>
                <div>
                    <FaUsers className="mx-auto text-purple-600 text-2xl" />
                    <h3 className="text-lg font-semibold">2,847</h3>
                    <p>Total Students</p>
                </div>
                <div>
                    <FaStar className="mx-auto text-yellow-500 text-2xl" />
                    <h3 className="text-lg font-semibold">4.9</h3>
                    <p>Avg Rating</p>
                </div>
                <div>
                    <LiaCertificateSolid className="mx-auto text-green-500 text-2xl" />
                    <h3 className="text-lg font-semibold">1200</h3>
                    <p>Certificates</p>
                </div>
                </div>
            </div>

            {/* Courses Created */}
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Courses Created</h2>
                <button className="bg-[#7CA982] text-white px-4 py-2 font-bold rounded-md hover:bg-white hover:text-[#7CA982] ">+ Create Course</button>
                </div>

                {[
                {
                    title: "Machine Learning Fundamentals",
                    desc: "Complete guide to ML algorithms and applications",
                    students: 847,
                    rating: "4.9 (156 reviews)",
                    status: "Active",
                },
                {
                    title: "Python for Data Science",
                    desc: "Learn Python programming for data analysis",
                    students: 1234,
                    rating: "4.9 (289 reviews)",
                    status: "Active",
                },
                {
                    title: "Deep Learning with TensorFlow",
                    desc: "Advanced neural networks and deep learning",
                    students: 566,
                    rating: "4.9 (86 reviews)",
                    status: "Draft",
                }
                ].map((course, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-md flex justify-between items-start hover:shadow">
                    <div>
                    <h3 className="text-lg font-bold">{course.title}</h3>
                    <p className="text-sm text-gray-600">{course.desc}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1"><FaUsers /> {course.students} students</div>
                        <div className="flex items-center gap-1"><FaStar /> {course.rating}</div>
                        <span className={`font-semibold ${course.status === 'Active' ? 'text-green-600' : 'text-orange-500'}`}>{course.status}</span>
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

            {/* Right Section */}
            <div className="space-y-6">
            {/* Personal Info */}
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-xl font-bold">Personal Information</h2>
                <div className="space-y-3 text-gray-700 text-sm">
                <div className="flex items-start gap-3"><MdOutlineMail className='text-[#7CA982]' /><div><p>Email</p><p>Sarah.johnson@edu.com</p></div></div>
                <div className="flex items-start gap-3"><FaPhoneAlt  className='text-[#30c744]' /><div><p>Phone</p><p>+1 (555) 123-4567</p></div></div>
                <div className="flex items-start gap-3"><GiGraduateCap  className='text-purple-600'/><div><p>Department</p><p>Computer Science</p></div></div>
                <div className="flex items-start gap-3"><FaLocationDot className='text-[#ee4f28]' /><div><p>Location</p><p>San Francisco, CA</p></div></div>
                </div>
            </div>

            {/* Live Sessions */}
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-xl font-bold">Upcoming Live Sessions</h2>
                {[
                { title: "ML Q&A Session", desc: "Weekly questions and answers session", time: "Today, 3:00 PM", cta: "Join Now" },
                { title: "Python Workshop", desc: "Hands-on coding session", time: "Tomorrow, 2:00 PM", cta: "Schedule" },
                { title: "Office Hours", desc: "One-on-one student consultations", time: "Friday, 10:00 AM", cta: "Book Slot" },
                ].map((session, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                    <h4 className="font-semibold">{session.title}</h4>
                    <span className="text-sm text-green-600">{session.cta}</span>
                    </div>
                    <p className="text-sm text-gray-600">{session.desc}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <CiClock2 />
                    <p>{session.time}</p>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>
        </div>
    </div>
  );
};

export default InstructorProfilePage;
