'use client';

import { useState, useEffect } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('deviceId')) {
      localStorage.setItem('deviceId', crypto.randomUUID());
    }
  }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    setLoading(true);
    const deviceId = localStorage.getItem('deviceId');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, deviceId }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setMessage(data.message);
      localStorage.setItem(
        'user',
        JSON.stringify({
          _id: data.user._id.toString(),
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          image: data.user.image || null,
          role: data.user.role || 'user',
          deviceId,
        })
      );
      setTimeout(() => {
        const redirectUrl = localStorage.getItem('redirect') || '/';
        window.location.href = redirectUrl;
      }, 250);
    } else {
      setSuccess(false);
      setMessage(data.message || 'حدث خطأ أثناء تسجيل الدخول');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-[#D8E2EA] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">تسجيل الدخول</h2>

        {message && (
          <div
            className={`p-4 rounded-md mb-6 text-center transition-all ${
              success
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}
          >
            {message}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <span className="flex space-x-2">
              <span className="w-3 h-3 bg-gray-700 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-3 h-3 bg-gray-700 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-3 h-3 bg-gray-700 rounded-full animate-bounce"></span>
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
            >
              دخول
            </button>
          </form>
        )}
      </div>

      {/* ✨ Animations */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.2s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
