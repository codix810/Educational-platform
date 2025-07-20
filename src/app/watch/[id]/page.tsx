// app/watch/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function WatchCoursePage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [files, setFiles] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [courseRes, fileRes, examRes] = await Promise.all([
          fetch(`/api/courses/${id}`),
          fetch(`/api/files?courseId=${id}`),
          fetch(`/api/exams?courseId=${id}`)
        ]);

        const courseData = await courseRes.json();
        const filesData = await fileRes.json();
        const examsData = await examRes.json();

        setCourse(courseData);
        setFiles(filesData.files || []);
        setExams(examsData.exams || []);
        setLoading(false);
      } catch (err) {
        console.error("فشل تحميل بيانات الكورس:", err);
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          className="flex gap-2"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">{course?.title}</h1>
      <p className="text-gray-600">{course?.description}</p>

      {/* الملفات */}
      <div>
        <h2 className="text-xl font-bold text-gray-700 mb-4">ملفات الكورس</h2>
        {files.length > 0 ? (
          <table className="w-full text-left border rounded overflow-hidden shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4">الاسم</th>
                <th className="py-2 px-4">الحجم</th>
                <th className="py-2 px-4">تحميل</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 px-4">{file.title || file.originalName}</td>
                  <td className="py-2 px-4">{file.sizeMB} ميجا</td>
                  <td className="py-2 px-4">
                    <a
                      href={file.url}
                      download
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      تحميل
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">لا توجد ملفات متاحة.</p>
        )}
      </div>

 <div className="flex items-center justify-between">
  <div className="flex gap-4">
    <button
      onClick={() => router.push(`/watch/${id}/videos`)}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
    >
      مشاهدة الفيديوهات
    </button>
    {exams.length > 0 && (
      <button
        onClick={() => router.push(`/watch/${id}/exams`)}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded shadow"
      >
        دخول الامتحان
      </button>
    )}
  </div>
</div>
</div>

  );
}
