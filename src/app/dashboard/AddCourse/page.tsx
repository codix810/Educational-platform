// @ts-ignore
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AddCoursePage() {
  const [form, setForm] = useState({
    title: '',
    price: '',
    description: '',
    image: '',
    teacherId: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState<{ _id: string; name: string }[]>([]);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return router.push('/not-found.js');

    const user = JSON.parse(userData);
    if (user.role !== 'admin') return router.push('/not-found.js');

    setTimeout(() => setLoading(false), 1000);
  }, [router]);

  useEffect(() => {
    const fetchTeachers = async () => {
      const res = await fetch('/api/users');
      const data = await res.json();
      const onlyTeachers = data.users.filter((u: any) => u.role === 'teacher');
      setTeachers(onlyTeachers);
    };

    fetchTeachers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!imageFile) {
      alert("يرجى اختيار صورة للكورس");
      return;
    }

    try {
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


const res = await fetch('/api/courses', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ...form,
    image: imgData.secure_url,
    public_id: imgData.public_id, // ⬅️ أضف السطر ده
  }),
});

      if (res.ok) {
        router.push('/dashboard');
      } else {
        alert('حدث خطأ أثناء إضافة الكورس');
      }
    } catch (err: any) {
      alert('خطأ أثناء رفع الصورة أو إرسال البيانات: ' + err.message);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto mt-10 p-6 bg-[#F0F4F8] rounded-2xl shadow text-gray-800"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-[#374151]">
        إضافة كورس جديد
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block mb-1 font-medium">اسم الكورس</label>
          <input
            type="text"
            name="title"
            value={form.title}
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
            value={form.price}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">الوصف</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-medium">صورة الكورس</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">اختيار مدرس</label>
          <select
            name="teacherId"
            value={form.teacherId}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
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
          حفظ الكورس
        </motion.button>
      </form>
    </motion.div>
  );
}
