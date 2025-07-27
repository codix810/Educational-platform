'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/purchases/full')
      .then((res) => res.json())
      .then((data) => setPurchases(data))
      .catch((err) => {
        console.error('Error fetching purchases:', err);
        setMessage({ type: 'error', text: 'فشل في تحميل البيانات' });
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredPurchases = purchases.filter((p) =>
    p.userName?.toLowerCase().includes(search.toLowerCase()) ||
    p.courseTitle?.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = filteredPurchases.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0);
  const totalPurchases = filteredPurchases.length;
  const uniqueCourses = new Set(filteredPurchases.map(p => p.courseTitle)).size;
  const uniqueUsers = new Set(filteredPurchases.map(p => p.userName)).size;

  const handleRefundAndDelete = async (purchaseId, userId, price) => {
    try {
      const res = await fetch(`/api/purchases/${purchaseId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, price })
      });
      const result = await res.json();
      if (res.ok) {
        setPurchases((prev) => prev.filter((p) => p._id !== purchaseId));
        setMessage({ type: 'success', text: ' تم حذف الكورس واسترجاع المبلغ للعميل.' });
      } else {
        setMessage({ type: 'error', text: result.message || ' حدث خطأ أثناء الحذف' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: ' فشل في الاتصال بالخادم' });
    }
    setConfirmId(null);
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-center text-gray-800"
      >
        لوحة التحكم - المشتريات
      </motion.h1>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded px-4 py-3 text-sm text-center font-semibold ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <StatBox title=" عدد المشتريات" value={totalPurchases} bg="bg-blue-100" />
        <StatBox title=" الأرباح" value={`${Math.round(totalRevenue)} جنيه`} bg="bg-green-100" />
        <StatBox title=" الكورسات المختلفة" value={uniqueCourses} bg="bg-yellow-100" />
        <StatBox title=" عدد المشترين" value={uniqueUsers} bg="bg-purple-100" />
      </div>

      <div className="flex items-center gap-2 w-full md:w-1/2 mx-auto">
        <input
          type="text"
          placeholder="ابحث عن مشتريات بالاسم أو الكورس"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-sm"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
        <table className="w-full table-auto text-gray-700 text-sm">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="border px-4 py-2">المستخدم</th>
              <th className="border px-4 py-2">الكورس</th>
              <th className="border px-4 py-2">السعر</th>
              <th className="border px-4 py-2">التاريخ</th>
              <th className="border px-4 py-2">تحكم</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading ? (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <td colSpan={5} className="p-6 text-gray-400 animate-pulse text-xl">
                    ... جاري التحميل
                  </td>
                </motion.tr>
              ) : filteredPurchases.length > 0 ? (
                filteredPurchases.map((purchase) => (
                  <motion.tr
                    key={purchase._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center bg-white hover:bg-gray-50 transition"
                  >
                    <td className="border px-4 py-2">{purchase.userName}</td>
                    <td className="border px-4 py-2">{purchase.courseTitle}</td>
                    <td className="border px-4 py-2">{parseFloat(purchase.price).toFixed(0)} جنيه</td>
                    <td className="border px-4 py-2">{new Date(purchase.createdAt).toLocaleDateString('ar-EG')}</td>
                    <td className="border px-4 py-2">
                      {confirmId === purchase._id ? (
                        <div className="space-y-2">
                          <div className="text-sm text-gray-700">هل أنت متأكد من حذف الكورس لهذا المستخدم؟</div>
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleRefundAndDelete(purchase._id, purchase.userId, purchase.price)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                            >نعم</button>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded"
                            >لا</button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmId(purchase._id)}
                          className="flex justify-center bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded mx-auto"
                        >
                          <TrashIcon className="h-4 w-4" /> حذف + استرجاع
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <td colSpan={5} className="p-6 text-gray-400">
                    لا توجد مشتريات حاليًا.
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatBox({ title, value, bg }) {
  return (
    <motion.div
      className={`rounded-xl p-4 text-center shadow-sm ${bg}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-xl font-bold text-gray-800 mt-1">{value}</div>
    </motion.div>
  );
}