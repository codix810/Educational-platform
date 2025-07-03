'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PencilIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function InfoSection({ user, formData, setFormData, editing, setEditing, handleSave }) {
  const router = useRouter();

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, image: URL.createObjectURL(file) });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/Login');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-2xl shadow-xl space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-800">معلوماتي</h3>
        <div className="flex gap-3">
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-1 px-4 py-1.5 bg-yellow-400 text-white rounded-xl hover:bg-yellow-500 transition"
          >
            <PencilIcon className="h-5 w-5" />
            {editing ? 'إلغاء' : 'تعديل'}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-4 py-1.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            خروج
          </button>
        </div>
      </div>

      {/* User Image + Info */}
      <motion.div layout className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <motion.img
          src={formData.image || '/default-user.png'}
          className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-md"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        <div className="w-full space-y-3">
          <input
            type="text"
            name="name"
            disabled={!editing}
            value={formData.name}
            onChange={handleInputChange}
            placeholder="الاسم"
            className="w-full p-2.5 border rounded-lg bg-gray-50 disabled:bg-gray-100"
          />
          <input
            type="email"
            name="email"
            disabled={!editing}
            value={formData.email}
            onChange={handleInputChange}
            placeholder="البريد الإلكتروني"
            className="w-full p-2.5 border rounded-lg bg-gray-50 disabled:bg-gray-100"
          />
          <input
            type="tel"
            name="phone"
            disabled={!editing}
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="رقم الهاتف"
            className="w-full p-2.5 border rounded-lg bg-gray-50 disabled:bg-gray-100"
          />
          {editing && (
            <>
              <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
              <motion.button
                onClick={handleSave}
                whileTap={{ scale: 0.95 }}
                className="mt-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
              >
                حفظ التغييرات
              </motion.button>
            </>
          )}
        </div>
      </motion.div>

      {/* Login Stats */}
      <div className="pt-4 border-t space-y-3 text-sm text-gray-700">
        <div className="grid sm:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-4 shadow-inner">
            <p className="text-gray-500">تاريخ إنشاء الحساب</p>
            <p className="font-bold text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 shadow-inner">
            <p className="text-gray-500">عدد مرات الدخول</p>
            <p className="font-bold text-blue-600">{user.loginCount || 0}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 shadow-inner">
            <p className="text-gray-500">آخر دخول</p>
            <p className="font-bold text-green-600">
              {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'غير متوفر'}
            </p>
          </div>
        </div>

        {/* نسبة الدخول */}
        <div className="mt-4">
          <p className="font-semibold text-gray-600 mb-1">نسبة الدخول التقديرية</p>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(user.loginCount, 100)}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
