"use client";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function VodafoneCash() {
  const amountRef = useRef();
  const fromPhoneRef = useRef();
  const imageRef = useRef();

  const [userData, setUserData] = useState({ _id: "", email: "", phone: "" });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return;

    const parsedUser = JSON.parse(savedUser);
    if (!parsedUser?._id) return;

    setUserData({
      _id: parsedUser._id,
      email: parsedUser.email,
      phone: parsedUser.phone,
    });

    fetchRequests(parsedUser._id);
  }, []);

  const fetchRequests = async (uid) => {
    try {
      const res = await fetch(`/api/update-profile/wallet?userId=${uid}`);
      const data = await res.json();

      const filtered = (data.requests || []).filter(
        (r) => r.method === "vodafone_cash"
      );
      setRequests(filtered);
    } catch (err) {
      console.error(" فشل جلب الطلبات:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const imageFile = imageRef.current.files[0];
    if (!imageFile) {
      setError(" من فضلك اختر صورة");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "unsigned_dashboard");
      formData.append("folder", "wallet_images");

      const uploadRes = await fetch("https://api.cloudinary.com/v1_1/dfbadbos5/auto/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok || !uploadData.secure_url || !uploadData.public_id) {
        throw new Error("فشل رفع الصورة إلى Cloudinary");
      }

      const backendPayload = {
        method: "vodafone_cash",
        amount: amountRef.current.value,
        fromPhone: fromPhoneRef.current.value,
        url: uploadData.secure_url,
        public_id: uploadData.public_id,
        userId: userData._id, //  المستخدم 
      };

      const res = await fetch("/api/update-profile/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backendPayload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("تم إرسال طلب الشحن بنجاح");
        fetchRequests(userData._id);
      } else {
        setError("فشل الإرسال: " + data.message);
      }
    } catch (err) {
      console.error(" خطأ:", err);
      setError("حدث خطأ أثناء الإرسال: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* فورم الشحن */}
      <motion.form
        onSubmit={handleSubmit}
        className="p-4 border-2 border-red-300 rounded bg-white space-y-4 shadow"
      >
        <h4 className="text-lg font-bold text-red-700 mb-2">فودافون كاش</h4>

        {message && <div className="bg-green-100 text-green-700 px-4 py-2 rounded">{message}</div>}
        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>}

        <input type="text" value="01000000000" readOnly className="w-full border p-2 rounded bg-gray-100" />
        <input type="number" placeholder="المبلغ" className="w-full border p-2 rounded" required ref={amountRef} />
        <input type="text" placeholder="رقم الهاتف الذي تم التحويل منه" className="w-full border p-2 rounded" required ref={fromPhoneRef} />
        <input type="file" accept="image/*" className="w-full border p-2 rounded" required ref={imageRef} />

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full bg-red-500 hover:bg-red-700 text-white py-2 rounded font-semibold"
        >
          شحن
        </motion.button>
      </motion.form>

      {/* الطلبات السابقة */}
      {requests.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-md font-bold text-gray-700">الطلبات السابقة:</h4>
          {requests.map((r) => (
            <div key={r._id} className="border rounded p-3 bg-gray-50 space-y-1 shadow-sm">
              <p><strong>المبلغ:</strong> {r.amount} جنيه</p>
              <p><strong>من رقم:</strong> {r.fromPhone}</p>
              <p><strong>تاريخ:</strong> {new Date(r.createdAt).toLocaleString()}</p>
              <p>
                <strong>الحالة:</strong>{" "}
                <span className={
                  r.status === "approved" ? "text-green-600 font-semibold" :
                  r.status === "pending" ? "text-yellow-600 font-semibold" :
                  "text-red-600 font-semibold"
                }>
                  {r.status === "approved" ? "تمت الموافقة" : r.status === "pending" ? "قيد المراجعة" : "مرفوض"}
                </span>
              </p>
              <img src={r.url} alt="صورة الإيصال" className="w-32 rounded border mt-2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
