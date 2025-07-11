// @ts-ignore
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EnvelopeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useAdminGuard } from '../../../../hooks/useAdminGuard';

type Device = {
  email: string;
  devices?: {
    deviceId: string;
    userAgent: string;
    lastUsed: string;
  }[];
};

export default function DevicesPage() {
  useAdminGuard(); // ✅ حماية الأدمن فقط

  const [deviceData, setDeviceData] = useState<Device[]>([]);
  const [filteredData, setFilteredData] = useState<Device[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ تحميل الأجهزة
  useEffect(() => {
    fetch('/api/devices')
      .then((res) => res.json())
      .then((data) => {
        const sorted = (data.data || []).sort((a: any, b: any) => a.email.localeCompare(b.email));
        setDeviceData(sorted);
        setFilteredData(sorted);
        setLoading(false);
      });
  }, []);

  // ✅ البحث بالإيميل
  useEffect(() => {
    const filtered = deviceData.filter((u) =>
      u.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [search, deviceData]);

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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 max-w-7xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">لوحة إدارة الأجهزة</h1>

      {/* ✅ الإحصائيات */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
      >
        <div className="bg-[#E3F2FD] text-[#1565C0] p-4 rounded-lg shadow text-center">
          <p className="text-sm">إجمالي المستخدمين</p>
          <p className="text-2xl font-bold">{deviceData.length}</p>
        </div>
        <div className="bg-[#FCE4EC] text-[#AD1457] p-4 rounded-lg shadow text-center">
          <p className="text-sm">عدد الأجهزة</p>
          <p className="text-2xl font-bold">
            {
              deviceData.reduce((acc, u) => {
                if (Array.isArray(u.devices)) {
                  return acc + u.devices.length;
                }
                return acc;
              }, 0)
            }
          </p>
        </div>
        <div className="bg-[#E8F5E9] text-[#2E7D32] p-4 rounded-lg shadow text-center">
          <p className="text-sm">عدد المستخدمين النشطين</p>
          <p className="text-2xl font-bold">
            {
              deviceData.filter((u) => Array.isArray(u.devices) && u.devices.length > 0).length
            }
          </p>
        </div>
      </motion.div>

      {/* ✅ البحث */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center w-full max-w-md bg-white rounded-md border px-3 py-2 shadow-sm">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="ابحث بالبريد الإلكتروني..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>
      </div>

      {filteredData.length === 0 && (
        <p className="text-center text-gray-500 mt-10">لا يوجد نتائج تطابق البحث.</p>
      )}

      {filteredData.map((user, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="mb-10 overflow-x-auto bg-white rounded-xl shadow-md p-6 border border-gray-200"
        >
          <h2 className="text-lg flex items-center font-semibold mb-4 text-blue-600">
            <EnvelopeIcon className="h-5 w-5 mr-2" />
            {user.email}
          </h2>

          {Array.isArray(user.devices) && user.devices.length > 0 ? (
            <table className="w-full table-auto border-collapse text-sm text-gray-800">
              <thead>
                <tr className="bg-gray-100 text-gray-900 text-center">
                  <th className="border px-4 py-2">#</th>
                  <th className="border px-4 py-2">معرّف الجهاز</th>
                  <th className="border px-4 py-2">المتصفح</th>
                  <th className="border px-4 py-2">آخر استخدام</th>
                </tr>
              </thead>
              <tbody>
                {user.devices.map((d, idx) => (
                  <tr
                    key={idx}
                    className="text-center bg-white hover:bg-gray-50 transition"
                  >
                    <td className="border px-3 py-1">{idx + 1}</td>
                    <td className="border px-3 py-1 break-words">{d.deviceId}</td>
                    <td className="border px-3 py-1">{d.userAgent}</td>
                    <td className="border px-3 py-1">{d.lastUsed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">لا توجد أجهزة مسجلة لهذا المستخدم.</p>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
