'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function EditCoursePage() {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams();

  // ✅ حماية الأدمن
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return router.push('/login');

    const user = JSON.parse(userData);
    if (user.role !== 'admin') return router.push('/');
  }, [router]);

  // ✅ تحميل بيانات الكورس
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${id}`);
        const data = await res.json();
        setCourseData(data);
        setLoading(false);
      } catch (err) {
        console.error('❌ Error fetching course:', err);
      }
    };
    if (id) fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData),
      });

      const text = await res.text();
      console.log('Response status:', res.status);
      console.log('Response body:', text);

      if (res.ok) {
        router.push('/dashboard');
      } else {
        alert('حدث خطأ أثناء التعديل: ' + text);
      }
    } catch (err) {
      console.error('❌ Error submitting update:', err);
      alert('حدث خطأ أثناء إرسال البيانات');
    }
  };

  // ✅ تحميل
  if (loading || !courseData) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto mt-10 p-6 bg-[#F0F4F8] rounded-2xl shadow text-gray-800"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-[#374151]">
        تعديل بيانات الكورس
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block mb-1 font-medium">اسم الكورس</label>
          <input
            type="text"
            name="title"
            value={courseData.title || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">السعر</label>
          <input
            type="number"
            name="price"
            value={courseData.price || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">الوصف</label>
          <textarea
            name="description"
            value={courseData.description || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-medium">رابط الصورة</label>
          <input
            type="text"
            name="image"
            value={courseData.image || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-[#A7D7C5] text-black font-semibold py-2 rounded-md hover:bg-[#8DC6AF] transition"
        >
          حفظ التعديلات
        </motion.button>
      </form>
    </motion.div>
  );
}
