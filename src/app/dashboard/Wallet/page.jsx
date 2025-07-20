"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAdminGuard } from '../../../../hooks/useAdminGuard';

export default function AllWalletRequests() {
        useAdminGuard(); //  حماية الأدمن فقط

  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/update-profile/wallet");
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err) {
      console.error(" فشل جلب الطلبات:", err);
    }
  };

  const handleUpdateStatus = async (id, currentStatus, newStatus) => {
    try {
      const res = await fetch(`/api/update-profile/wallet/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("فشل التحديث");
      fetchRequests();
    } catch (err) {
      console.error(" فشل تحديث الحالة:", err.message);
    }
  };

  const filteredRequests = requests.filter((r) =>
    r.userEmail?.toLowerCase().includes(search.toLowerCase())
  );

  const renderStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-700";
      case "rejected":
        return "text-red-700";
      default:
        return "text-blue-700";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">طلبات الشحن</h2>

      <input
        type="text"
        placeholder="ابحث بالإيميل..."
        className="mb-6 p-2 w-full max-w-md border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredRequests.length === 0 ? (
        <p className="text-center text-gray-500">لا يوجد طلبات حالياً.</p>
      ) : (
        <div className="overflow-x-auto">
          <motion.table
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-w-full bg-white rounded-xl shadow-md overflow-hidden"
          >
            <thead className="bg-yellow-100">
              <tr className="text-gray-700 text-sm">
                <th className="px-4 py-3">الطريقة</th>
                <th className="px-4 py-3">المبلغ</th>
                <th className="px-4 py-3">الإيميل</th>
                <th className="px-4 py-3">الحالة</th>
                <th className="px-4 py-3">التاريخ</th>
                <th className="px-4 py-3">صورة</th>
                <th className="px-4 py-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-200">
              {filteredRequests.map((r) => (
                <tr
                  key={r._id}
                  className={
                    r.status === "approved"
                      ? "bg-green-50"
                      : r.status === "rejected"
                      ? "bg-red-50"
                      : "hover:bg-yellow-50"
                  }
                >
                  <td className="px-4 py-3">{r.method === "vodafone_cash" ? "فودافون كاش" : r.method}</td>
                  <td className="px-4 py-3">{r.amount} جنيه</td>
                  <td className="px-4 py-3">{r.userEmail || "غير متوفر"}</td>
                  <td className={`px-4 py-3 font-medium ${renderStatusColor(r.status)}`}>{r.status}</td>
                  <td className="px-4 py-3">{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {r.url ? (
                      <img src={r.url} alt="صورة التحويل" className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <span className="text-gray-400">لا يوجد</span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex flex-wrap gap-2">
                    {r.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(r._id, r.status, "approved")}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          شحن
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(r._id, r.status, "rejected")}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          رفض
                        </button>
                      </>
                    )}
                    {r.status === "rejected" && (
                      <button
                        onClick={() => handleUpdateStatus(r._id, r.status, "approved")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        إعادة قبول
                      </button>
                    )}
                    {r.status === "approved" && (
                      <button
                        onClick={() => handleUpdateStatus(r._id, r.status, "rejected")}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm"
                      >
                        رفض
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      )}
    </div>
  );
}
