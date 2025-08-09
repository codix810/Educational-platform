'use client';

import { useEffect, useState } from 'react';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      setError('يجب تسجيل الدخول لعرض الرسائل');
      setLoading(false);
      return;
    }

    const user = JSON.parse(userStr);
    if (!user._id) {
      setError('بيانات المستخدم غير مكتملة');
      setLoading(false);
      return;
    }

    fetch(`/api/messages?userId=${user._id}`)
      .then(res => res.json())
      .then(data => {
        if (data.messages) setMessages(data.messages);
        else setMessages([]);
        setLoading(false);
      })
      .catch(() => {
        setError('فشل جلب الرسائل');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>جاري تحميل الرسائل...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (messages.length === 0) return <p>لا توجد رسائل حتى الآن.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">رسائلي</h2>
      {messages.map((msg) => (
        <div key={msg._id} className="p-4 border rounded shadow bg-white">
          <p><strong>المرسل:</strong> {msg.name || 'غير معروف'}</p>
          <p><strong>البريد الإلكتروني:</strong> {msg.email || 'غير متوفر'}</p>
          <p><strong>الرسالة:</strong> {msg.message}</p>
          <p className="text-xs text-gray-500 mt-2">أُرسلت في: {new Date(msg.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
