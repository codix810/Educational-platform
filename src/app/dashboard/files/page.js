//  المسار: src/app/dashboard/files/page.js  ده المساول عن  ادارت الملفات
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrashIcon,
  PencilIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import {ArrowLeft,} from 'lucide-react';

export default function FilesDashboardPage() {
  const [files, setFiles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, message: '', action: null });
  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return router.push('/not-found.js');

    const user = JSON.parse(userData);
    if (user.role !== 'admin') return router.push('/not-found.js');

    const fetchData = async () => {
      try {
        const [coursesRes, filesRes] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/files'),
        ]);

        if (!coursesRes.ok || !filesRes.ok) throw new Error('فشل جلب البيانات');

        const coursesData = await coursesRes.json();
        const filesData = await filesRes.json();

        setCourses(coursesData.courses || []);
        setFiles(filesData.files || []);
      } catch (error) {
        showToast('حدث خطأ أثناء جلب البيانات', 'error');
        console.error(' Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

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

  const deleteFile = async (file) => {
    try {
      const res = await fetch(`/api/files/${file._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f._id !== file._id));
        showToast('تم حذف الملف بنجاح', 'success');
      } else {
        showToast(data.message || 'فشل الحذف', 'error');
      }
    } catch (error) {
      showToast('حدث خطأ أثناء الحذف', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F9FAFB]">
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

  const filteredCourses = courses.map((course) => {
    const courseFiles = files.filter(
      (f) => f.courseId === course._id &&
      (course.title.includes(searchQuery) || f.title.includes(searchQuery))
    );
    return { ...course, files: courseFiles };
  }).filter((c) => c.files.length > 0);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <motion.h1
        className="text-3xl font-bold text-center mb-6 text-[#344955]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        لوحة إدارة الملفات
      </motion.h1>
      
      <div className="relative max-w-md mx-auto mb-6">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-3 right-3" />
        <input
          type="text"
          placeholder="ابحث باسم الكورس أو الملف..."
          className="w-full border px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
        <button
          onClick={() => router.back()}
          className="flex items-center bg-[white] hover:bg-[#f4f4f4] text-[#00695C] ">
          <ArrowLeft className="w-4 h-4" /> رجوع
        </button>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 text-center">
        <div className="bg-blue-100 text-blue-800 rounded-xl p-4 shadow-md">
          <h3 className="text-lg font-bold">عدد الكورسات</h3>
          <p className="text-2xl">{courses.length}</p>
        </div>
        <div className="bg-green-100 text-green-800 rounded-xl p-4 shadow-md">
          <h3 className="text-lg font-bold">عدد الملفات</h3>
          <p className="text-2xl">{files.length}</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 rounded-xl p-4 shadow-md">
          <h3 className="text-lg font-bold">إجمالي الحجم</h3>
          <p className="text-2xl">{files.reduce((a, f) => a + parseFloat(f.sizeMB), 0).toFixed(2)} MB</p>
        </div>
        <div className="bg-purple-100 text-purple-800 rounded-xl p-4 shadow-md">
          <h3 className="text-lg font-bold">متوسط الحجم</h3>
          <p className="text-2xl">{(files.length ? (files.reduce((a, f) => a + parseFloat(f.sizeMB), 0) / files.length).toFixed(2) : 0)} MB</p>
        </div>
      </div>

      {filteredCourses.map(({ _id, title, files }) => (
        <motion.div
          key={_id}
          className="mb-10 border rounded-xl bg-white shadow-md p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {title} <span className="text-sm text-gray-500">({files.length} ملف)</span>
            </h2>
            <button
              onClick={() => openModal('هل أنت متأكد من إضافة ملف جديد؟', () => router.push(`/dashboard/courses/${_id}/add-files`))}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow flex items-center gap-1"
            >
              <DocumentArrowDownIcon className="h-5 w-5" /> إضافة ملف
            </button>
          </div>
<div className="overflow-x-auto">
  <table className="min-w-full table-auto border-collapse text-sm">

            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border px-3 py-2">الاسم</th>
                <th className="border px-3 py-2">النوع</th>
                <th className="border px-3 py-2">الحجم</th>
                <th className="border px-3 py-2">الرابط</th>
                <th className="border px-3 py-2">تحكم</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <motion.tr
                  key={file._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center hover:bg-gray-50 transition"
                >
                  <td className="border px-3 py-2 font-medium">{file.title}</td>
                  <td className="border px-3 py-2">{file.type}</td>
                  <td className="border px-3 py-2">{file.sizeMB} MB</td>
                  <td className="border px-3 py-2 text-blue-600 underline">
                    <a href={file.url} target="_blank" rel="noopener noreferrer">رابط</a>
                  </td>
                  <td className="border px-3 py-2">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => openModal('هل تريد تعديل هذا الملف؟', () => router.push(`/dashboard/files/edit/${file._id}`))}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded flex items-center gap-1"
                      >
                        <PencilIcon className="h-4 w-4" /> تعديل
                      </button>
                      <button
                        onClick={() => openModal('هل تريد حذف هذا الملف؟', () => deleteFile(file))}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1"
                      >
                        <TrashIcon className="h-4 w-4" /> حذف
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          </div>
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
