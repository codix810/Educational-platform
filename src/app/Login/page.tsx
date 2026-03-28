'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('deviceId')) {
      localStorage.setItem('deviceId', crypto.randomUUID());
    }
  }, []);

  const handleSubmit = async (e: any) => {
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
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          تسجيل الدخول
        </h2>

        {message && (
          <div
            className={`p-4 rounded mb-6 text-center ${
              success
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-4 border-gray-300 border-t-[#7CA982] rounded-full animate-spin"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <input
              type="email"
              list="emailSuggestions"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-[#7CA982] outline-none"
            />

            {/* اقتراحات الإيميل */}
            <datalist id="emailSuggestions">
              <option value="@gmail.com" />
              <option value="@outlook.com" />
              <option value="@hotmail.com" />
              <option value="@yahoo.com" />
            </datalist>

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-[#7CA982] outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full py-2 rounded bg-[#7CA982] hover:opacity-90 text-white font-semibold transition"
            >
              دخول
            </button>

          </form>
        )}
      </div>
    </div>
  );
}