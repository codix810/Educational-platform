'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { TrashIcon, Search } from 'lucide-react';

// تعريف النوع لكل نتيجة
type ExamResult = {
  _id: string | { $oid: string };
  userName: string;
  courseTitle: string;
  examTitle: string;
  score: number;
  createdAt: string;
};

// مكون الصفحة
export default function ExamResultsPage() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/exams/all')
      .then((res) => res.json())
      .then((data) => setResults(data))
      .catch((err) => console.error('Error fetching exam results:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string | { $oid: string }) => {
    try {
      if (!confirm('هل أنت متأكد من حذف هذه النتيجة؟')) return;

      const objectId = typeof id === 'object' && id.$oid ? id.$oid : id;

      const res = await fetch(`/api/exam-results/${objectId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      });

      if (!res.ok) {
        const errMsg = await res.json();
        alert('فشل الحذف: ' + (errMsg.message || ''));
        return;
      }

      setResults((prev) =>
        prev.filter((r) => {
          const rId = typeof r._id === 'object' && r._id?.$oid ? r._id.$oid : r._id;
          return rId !== objectId;
        })
      );
    } catch (error) {
      console.error('Delete Error:', error);
    }
  };

  const filtered = results.filter((exam) =>
    exam.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.examTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedByCourse = filtered.reduce((acc: Record<string, ExamResult[]>, item) => {
    if (!acc[item.courseTitle]) acc[item.courseTitle] = [];
    acc[item.courseTitle].push(item);
    return acc;
  }, {});

  const totalCourses = Object.keys(groupedByCourse).length;
  const totalResults = results.length;
  const totalStudents = new Set(results.map((r) => r.userName)).size;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center text-[#344955] mb-6"
      >
        نتائج امتحانات الطلاب
      </motion.h1>

      {/* شريط البحث */}
      <div className="max-w-md mx-auto flex items-center border rounded-lg shadow-sm px-4 py-2 bg-white">
        <Search className="w-5 h-5 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="ابحث باسم الطالب أو الكورس أو الامتحان"
          className="w-full outline-none bg-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* الإحصائيات */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1 },
          },
        }}
      >
        <StatBox title=" عدد الكورسات" value={totalCourses} bg="bg-blue-100" />
        <StatBox title=" عدد الطلاب" value={totalStudents} bg="bg-yellow-100" />
        <StatBox title=" عدد النتائج" value={totalResults} bg="bg-green-100" />
      </motion.div>

      {/* جدول النتائج */}
      {loading ? (
        <div className="text-center text-gray-500 animate-pulse mt-10">... جاري التحميل</div>
      ) : (
        Object.entries(groupedByCourse).map(([courseTitle, exams]) => (
          <motion.div
            key={courseTitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white shadow rounded-xl p-4 border mt-8"
          >
            <h2 className="text-xl font-semibold text-blue-700 mb-4 border-b pb-2"> {courseTitle}</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm text-gray-700">
                <thead>
                  <tr className="bg-gray-100 text-center">
                    <th className="border px-4 py-2"> الطالب</th>
                    <th className="border px-4 py-2"> الامتحان</th>
                    <th className="border px-4 py-2"> الدرجة</th>
                    <th className="border px-4 py-2"> التاريخ</th>
                    <th className="border px-4 py-2"> حذف</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam, index) => (
                    <tr key={index} className="text-center hover:bg-gray-50">
                      <td className="border px-4 py-2">{exam.userName}</td>
                      <td className="border px-4 py-2">{exam.examTitle}</td>
                      <td className="border px-4 py-2">{exam.score}</td>
                      <td className="border px-4 py-2">
                        {new Date(exam.createdAt).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleDelete(exam._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="w-5 h-5 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}

// نوع الخصائص + مكون الإحصائيات مع العدّ المتحرك
type StatBoxProps = {
  title: string;
  value: number;
  bg?: string;
};

function StatBox({ title, value, bg }: StatBoxProps) {
  return (
    <motion.div
      className={`rounded-xl p-6 text-center shadow-sm ${bg || 'bg-white'}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-3xl font-bold text-gray-800 mt-1">
        <CountUp end={value} duration={1.5} />
      </div>
    </motion.div>
  );
}
