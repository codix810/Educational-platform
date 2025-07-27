'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrashIcon,
  PencilIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import {ArrowLeft,} from 'lucide-react';
export default function ExamsPage() {
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, message: '', action: null });
  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return router.push('/not-found.js');

    const user = JSON.parse(userData);
    if (user.role !== 'admin') return router.push('/not-found.js');

    const fetchData = async () => {
      try {
        const [coursesRes, examsRes] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/exams'),
        ]);

        const coursesData = await coursesRes.json();
        let examsData = { exams: [] };

        if (examsRes.ok) {
          examsData = await examsRes.json();
        } else {
          console.error('❌ فشل جلب الامتحانات');
        }

        setCourses(coursesData.courses || []);
        setExams(examsData.exams || []);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error:', error);
      }
    };

    fetchData();
  }, []);

  const openModal = (message, action) => {
    setModal({ open: true, message, action });
  };

  const closeModal = () => {
    setModal({ open: false, message: '', action: null });
  };

  const confirmModal = () => {
    if (modal.action) modal.action();
    closeModal();
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: '', type: '', visible: false }), 3000);
  };

  const deleteExam = async (id) => {
    try {
      const res = await fetch(`/api/exams/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setExams((prev) => prev.filter((exam) => exam._id !== id));
        showToast('تم حذف الامتحان بنجاح', 'success');
      } else {
        showToast('فشل حذف الامتحان', 'error');
      }
    } catch (error) {
      showToast('حدث خطأ أثناء الحذف', 'error');
    }
  };

const filteredCourses = courses.map(course => {
  const courseExams = exams.filter(exam =>
    exam.courseId === course._id &&
    (course.title.toLowerCase().includes(search.toLowerCase()) ||
     exam.title.toLowerCase().includes(search.toLowerCase()))
  );

  return {
    ...course,
    exams: courseExams,
    isMatch: courseExams.length > 0 || course.title.toLowerCase().includes(search.toLowerCase())
  };
}).filter(course => course.isMatch);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F0F4F8]">
        <motion.div
          className="flex gap-2"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
        </motion.div>
      </div>
    );
  }

  const totalQuestions = exams.reduce((acc, exam) => acc + exam.questions.length, 0);
  const averageQuestions = exams.length ? (totalQuestions / exams.length).toFixed(1) : 0;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <motion.h1
        className="text-3xl font-bold text-center mb-6 text-[#2E3A59]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        لوحة إدارة الامتحانات
      </motion.h1>

      <div className="relative max-w-md mx-auto mb-6">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-3 right-3" />
        <input
          type="text"
          placeholder="ابحث باسم الكورس أو الامتحان..."
          className="w-full border px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
        <button
          onClick={() => router.back()}
          className="flex items-center bg-[white] hover:bg-[#f4f4f4] text-[#00695C] ">
          <ArrowLeft className="w-4 h-4" /> رجوع
        </button>      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 text-center">
        <div className="bg-blue-100 text-blue-800 rounded-xl p-4 shadow-md">
          <h3 className="text-lg font-bold">عدد الكورسات</h3>
          <p className="text-2xl">{courses.length}</p>
        </div>
        <div className="bg-green-100 text-green-800 rounded-xl p-4 shadow-md">
          <h3 className="text-lg font-bold">عدد الامتحانات</h3>
          <p className="text-2xl">{exams.length}</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 rounded-xl p-4 shadow-md">
          <h3 className="text-lg font-bold">إجمالي الأسئلة</h3>
          <p className="text-2xl">{totalQuestions}</p>
        </div>
        <div className="bg-purple-100 text-purple-800 rounded-xl p-4 shadow-md">
          <h3 className="text-lg font-bold">متوسط الأسئلة</h3>
          <p className="text-2xl">{averageQuestions}</p>
        </div>
      </div>

      {filteredCourses.map((course) => (
        <motion.div
          key={course._id}
          className="mb-10 border rounded-xl bg-white shadow-md p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {course.title} <span className="text-sm text-gray-500">({course.exams.length} امتحان)</span>
            </h2>
            <button
              onClick={() => router.push(`/dashboard/courses/${course._id}/add-exam`)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow flex items-center gap-1"
            >
              + إضافة امتحان
            </button>
          </div>

          {course.exams.map((exam) => (
            <motion.div
              key={exam._id}
              className="mb-4 border rounded-lg overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center bg-gray-100 p-3">
                <span className="font-medium text-gray-700">{exam.title}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal('هل تريد تعديل هذا الامتحان؟', () => router.push(`/dashboard/exams/edit/${exam._id}`))}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded flex items-center gap-1"
                  >
                    <PencilIcon className="w-4 h-4" /> تعديل
                  </button>
                  <button
                    onClick={() => openModal('هل تريد حذف هذا الامتحان؟', () => deleteExam(exam._id))}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1"
                  >
                    <TrashIcon className="w-4 h-4" /> حذف
                  </button>
                </div>
              </div>
              <table className="w-full border text-sm">
                <thead className="bg-[#ECEFF1] text-gray-800">
                  <tr>
                    <th className="border p-2">السؤال</th>
                    <th className="border p-2">الاختيارات</th>
                    <th className="border p-2">الإجابة</th>
                  </tr>
                </thead>
                <tbody>
                  {exam.questions.map((q, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="border p-2 font-medium text-gray-700">{q.question}</td>
                      <td className="border p-2">
                        <ul className="list-disc pl-4 text-gray-600">
                          {q.options.map((opt, idx) => (
                            <li key={idx}>{opt}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="border p-2 text-green-700 font-bold">{q.answer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          ))}
        </motion.div>
      ))}

      <AnimatePresence>
        {modal.open && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-sm text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <ExclamationTriangleIcon className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-4 text-gray-800">{modal.message}</h3>
              <div className="flex justify-center gap-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={confirmModal}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  تأكيد
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast.visible && (
          <motion.div
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg text-white flex items-center gap-2 text-sm ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {toast.type === 'success' ? (
              <CheckCircleIcon className="w-5 h-5 text-white" />
            ) : (
              <XCircleIcon className="w-5 h-5 text-white" />
            )}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
