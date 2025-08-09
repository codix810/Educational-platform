'use client';

import { useEffect, useState } from 'react';
import { PiStudentFill } from "react-icons/pi";
import { MdOutlinePlayLesson } from "react-icons/md";
import Link from 'next/link';

const InstructorsPage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("ALL");
  const [specialties, setSpecialties] = useState(["ALL"]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();

        const teacherUsers = (data.users || []).filter(user => user.role === 'teacher');
        setAllUsers(teacherUsers);
        setTeachers(teacherUsers);

        const uniqueSpecialties = ["ALL", ...new Set(teacherUsers.map(t => t.subject || "Not specified"))];
        setSpecialties(uniqueSpecialties);
      } catch (err) {
        console.error("Failed to load instructors:", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedSpecialty === "ALL") {
      setTeachers(allUsers);
    } else {
      setTeachers(allUsers.filter(t => t.subject === selectedSpecialty));
    }
  }, [selectedSpecialty, allUsers]);

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2">Featured Instructors</h1>
        <p className="text-center text-gray-600 mb-10">
          Choose your trainer by specialty and get ready for a better future
        </p>

        {/* Specialty Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {specialties.map((spec, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-4 py-2 rounded-full cursor-pointer border transition
                ${selectedSpecialty === spec
                  ? "bg-[#7CA982] text-white border-[#7CA982]"
                  : "bg-white text-gray-700 border-gray-300"}`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Instructor Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teachers.map((teacher, index) => (
            <Link href="/teacherprofile" key={index}>
              <div className="bg-white rounded-lg shadow p-6 text-center hover:scale-105 hover:shadow-2xl transition">
                <img
                  src={teacher.image || '/img/default-teacher.png'}
                  alt={teacher.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />

                <h3 className="text-xl font-bold">{teacher.name}</h3>
                <p className="text-[#7CA982]">{teacher.subject || "No specialty"}</p>

                <div className="w-20 h-1 bg-[#7CA982] mx-auto my-3" />

                <div className="flex justify-center gap-6 text-gray-600">
                  <div className="flex items-center gap-1">
                    <MdOutlinePlayLesson size={18} />
                    <span>{teacher.experience || 0}</span>
                    <span className="text-sm">years</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <PiStudentFill size={18} />
                    <span>+{Math.floor(Math.random() * 20) + 5}K</span>
                    <span className="text-sm">students</span>
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

export default InstructorsPage;
