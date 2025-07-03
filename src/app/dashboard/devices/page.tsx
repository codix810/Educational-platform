'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EnvelopeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

type UserDevice = {
  email: string;
  devices: {
    index: number;
    deviceId: string;
    userAgent: string;
    lastUsed: string;
  }[];
};

export default function DevicesPage() {
  const [deviceData, setDeviceData] = useState<UserDevice[]>([]);
  const [filteredData, setFilteredData] = useState<UserDevice[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return router.push('/login');

    const user = JSON.parse(userData);
    if (user.role !== 'admin') router.push('/');
  }, [router]);

  useEffect(() => {
    fetch('/api/devices')
      .then((res) => res.json())
      .then((data) => {
        const sorted: UserDevice[] = (data.data || []).sort((a: UserDevice, b: UserDevice) =>
          a.email.localeCompare(b.email)
        );
        setDeviceData(sorted);
        setFilteredData(sorted);
        setLoading(false);
      });
  }, []);

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
      className="p-6 max-w-6xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">سجل الأجهزة المرتبطة</h1>

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
          className="mb-10 overflow-x-auto bg-gradient-to-br from-[#F0F4F8] to-[#E8F5E9] rounded-xl shadow-md p-6 border border-gray-200"
        >
          <h2 className="text-lg flex items-center font-semibold mb-4 text-[#2E7D32]">
            <EnvelopeIcon className="h-5 w-5 mr-2" />
            {user.email}
          </h2>

          {user.devices.length > 0 ? (
            <table className="w-full table-auto border-collapse text-sm text-gray-800">
              <thead>
                <tr className="bg-[#C8E6C9] text-gray-900">
                  <th className="border px-4 py-2">#</th>
                  <th className="border px-4 py-2">معرّف الجهاز</th>
                  <th className="border px-4 py-2">المتصفح</th>
                  <th className="border px-4 py-2">آخر استخدام</th>
                </tr>
              </thead>
              <tbody>
                {user.devices.map((d, idx) => (
                  <tr key={idx} className="text-center bg-white hover:bg-gray-50 transition">
                    <td className="border px-3 py-1">{d.index}</td>
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
