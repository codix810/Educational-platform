'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAdminGuard } from '../../../../../hooks/useAdminGuard';

export default function EditUserPage() {
  useAdminGuard(); // ✅ حماية الأدمن فقط

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams();

  // ✅ تحميل بيانات المستخدم
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${id}`);
        const data = await res.json();
        setUserData(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    if (id) fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    router.push('/dashboard');
  };

  // ✅ شاشة تحميل بنقاط أنيميشن
  if (loading || !userData) {
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
        تعديل بيانات المستخدم
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block mb-1 font-medium">الاسم</label>
          <input
            type="text"
            name="name"
            value={userData.name || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">البريد الإلكتروني</label>
          <input
            type="email"
            name="email"
            value={userData.email || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">رقم الهاتف</label>
          <input
            type="text"
            name="phone"
            value={userData.phone || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">الدور</label>
          <select
            name="role"
            value={userData.role || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          >
            <option value="user">مستخدم</option>
            <option value="admin">أدمن</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">كلمة السر</label>
          <input
            type="text"
            name="password"
            value={userData.password || ''}
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
