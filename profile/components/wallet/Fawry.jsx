"use client";
import { useEffect, useState } from "react";

export default function FawryForm() {
  const [amount, setAmount] = useState("");
  const [userData, setUserData] = useState({ email: "", mobile: "", _id: "" });
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [refCode, setRefCode] = useState(null);
  const [expiry, setExpiry] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);

const fetchUserInfo = async () => {
  try {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) throw new Error("لا يوجد مستخدم مسجل الدخول");

    const parsedUser = JSON.parse(savedUser);

    const res = await fetch(`/api/users/${parsedUser._id}`);
    const data = await res.json();

    setUserData({
      _id: data._id,
      email: data.email,
      mobile: data.phone || data.mobile,
    });

    fetchRequests(data._id);
  } catch (err) {
    console.error(" فشل جلب بيانات المستخدم:", err.message);
    setError("حدث خطأ أثناء تحميل بيانات المستخدم");
  }
};


  const fetchRequests = async (userId) => {
    try {
      const res = await fetch(`/api/update-profile/wallet/fawry?userId=${userId}`);
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err) {
      console.error(" فشل جلب الطلبات:", err);
    }
  };

  const handleGenerateClick = () => {
    if (!amount) return alert(" من فضلك أدخل المبلغ");
    setConfirmVisible(true);
  };

  const confirmGenerate = async () => {
    setLoading(true);
    setError(null);
    setRefCode(null);

    try {
      const res = await fetch("/api/update-profile/wallet/fawry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          userId: userData._id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setRefCode(data.referenceNumber);
      setExpiry(data.expiry);
      await fetchRequests(userData._id);
    } catch (err) {
      console.error(" خطأ:", err.message);
      setError(err.message || "حدث خطأ أثناء إنشاء كود فوري");
    } finally {
      setLoading(false);
      setConfirmVisible(false);
    }
  };

  const copyToClipboard = () => {
    if (refCode) {
      navigator.clipboard.writeText(refCode);
      alert(" تم نسخ الكود");
    }
  };

  return (
    <div className="p-4 border-2 border-yellow-400 rounded bg-white space-y-4">
      <h3 className="text-xl font-bold text-yellow-700">فوري</h3>

      <input
        type="number"
        placeholder="المبلغ بالجنيه"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border p-2 rounded"
        disabled={loading}
      />

      <button
        onClick={handleGenerateClick}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded font-semibold"
        disabled={loading}
      >
        توليد كود فوري
      </button>

      {confirmVisible && (
        <div className="bg-yellow-100 border border-yellow-300 p-4 rounded space-y-2 mt-2">
          <p> الإيميل: <strong>{userData.email}</strong></p>
          <p> رقم الهاتف: <strong>{userData.mobile}</strong></p>
          <p> سيتم توليد كود فوري بمبلغ <strong>{amount} جنيه</strong></p>
          <div className="flex gap-2">
            <button onClick={confirmGenerate} className="bg-green-600 text-white px-4 py-1 rounded">
              {loading ? "جارٍ المعالجة..." : "تأكيد"}
            </button>
            <button onClick={() => setConfirmVisible(false)} className="bg-gray-400 text-white px-4 py-1 rounded">
              إلغاء
            </button>
          </div>
        </div>
      )}

      {refCode && (
        <div className="bg-green-100 p-3 rounded space-y-2">
          <p> تم إنشاء الكود بنجاح</p>
          <p> الكود: <strong>{refCode}</strong></p>
          <button
            onClick={copyToClipboard}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
          >
            نسخ الكود
          </button>
          <p> صالح حتى: {new Date(expiry).toLocaleString()}</p>
        </div>
      )}

      {error && <div className="text-red-600">{error}</div>}

      <div className="mt-4 space-y-2">
        <h4 className="font-bold text-gray-700">الطلبات السابقة:</h4>
        {requests.length === 0 && <p className="text-gray-500">لا يوجد طلبات سابقة.</p>}
        {requests.map((req, i) => (
          <div key={i} className="text-sm border-b py-2">
            <p> الكود: {req.refNumber}</p>
            <p> {req.amount} جنيه</p>
            <p> {new Date(req.createdAt).toLocaleString()}</p>
            <p> الحالة: {req.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
