'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function EditCoursePage() {
  const [courseData, setCourseData] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return router.push('/not-found.js');

    const user = JSON.parse(userData);
    if (user.role !== 'admin') return router.push('/not-found.js');
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, usersRes] = await Promise.all([
          fetch(`/api/courses/${id}`),
          fetch('/api/users')
        ]);

        const course = await courseRes.json();
        const usersData = await usersRes.json();
        const onlyTeachers = usersData.users.filter(u => u.role === 'teacher');

        setCourseData(course);
        setTeachers(onlyTeachers);
      } catch (err) {
        console.error('❌ Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = courseData.image;
      let public_id = courseData.public_id;

      if (imageFile) {
        const imageData = new FormData();
        imageData.append('file', imageFile);
        imageData.append('upload_preset', 'unsigned_dashboard');
        imageData.append('folder', 'course_images');

        const imgRes = await fetch("https://api.cloudinary.com/v1_1/dfbadbos5/image/upload", {
          method: "POST",
          body: imageData
        });

        const imgData = await imgRes.json();

        if (!imgRes.ok || !imgData.secure_url) {
          throw new Error("فشل رفع الصورة");
        }

        imageUrl = imgData.secure_url;
        public_id = imgData.public_id;
      }

      const res = await fetch(`/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...courseData,
          image: imageUrl,
          public_id,
        }),
      });

      const resultText = await res.text();
      if (res.ok) {
        router.push('/dashboard');
      } else {
        alert('❌ فشل التعديل: ' + resultText);
      }
    } catch (err) {
      alert('❌ خطأ أثناء التعديل: ' + err.message);
    }
  };

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
      <h2 className="text-2xl font-bold mb-6 text-center text-[#374151]">تعديل الكورس</h2>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block mb-1 font-medium">اسم الكورس</label>
          <input
            type="text"
            name="title"
            value={courseData.title || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
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
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">الوصف</label>
          <textarea
            name="description"
            value={courseData.description || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-medium">الصورة الحالية</label>
          <img src={courseData.image} alt="صورة الكورس" className="w-full max-h-48 rounded-md object-cover" />
        </div>

        <div>
          <label className="block mb-1 font-medium">تغيير الصورة (اختياري)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">اختيار مدرس</label>
          <select
            name="teacherId"
            value={courseData.teacherId || ''}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md"
          >
            <option value="">اختر مدرسًا</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
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
