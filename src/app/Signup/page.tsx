'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // مدرس فقط
  const [teacherImageUrl, setTeacherImageUrl] = useState('');
  const [subject, setSubject] = useState('');
  const [experience, setExperience] = useState('');
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('deviceId')) {
      localStorage.setItem('deviceId', crypto.randomUUID());
    }
  }, []);

  const handleImageUpload = async () => {
    const imageFile = imageInputRef.current?.files?.[0];
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'unsigned_dashboard');
    formData.append('folder', 'teacher_images');

    const res = await fetch('https://api.cloudinary.com/v1_1/dfbadbos5/image/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (res.ok && data.secure_url) {
      setTeacherImageUrl(data.secure_url);
      return data.secure_url;
    } else {
      throw new Error('فشل رفع الصورة');
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const deviceId = localStorage.getItem('deviceId');
    let imageUrl = '';

    try {
      if (role === 'teacher') {
        imageUrl = await handleImageUpload();
        if (!imageUrl) throw new Error('برجاء رفع صورة');
      }

      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          role,
          subject,
          experience,
          image: imageUrl
        })
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.user) {
        setSuccess(true);
        setMessage(data.message);

        localStorage.setItem('user', JSON.stringify({
          _id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          role: data.user.role,
          createdAt: data.user.createdAt,
          deviceId,
        }));

        setTimeout(() => {
          const redirectUrl = localStorage.getItem('redirect') || '/';
          window.location.href = redirectUrl;
        }, 600);
      } else {
        setSuccess(false);
        setMessage(data.message || 'حدث خطأ أثناء إنشاء الحساب');
      }
    } catch (err: any) {
      setLoading(false);
      setSuccess(false);
      setMessage(err.message || 'فشل التسجيل');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0fdf4] via-[#e6f4ea] to-[#c9e6d4] px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 animate-fade-in border border-[#cbe3d3]">
        <h2 className="text-3xl font-bold text-center text-[#2e7d4f] mb-6">إنشاء حساب</h2>

        {message && (
          <div className={`p-4 rounded-md mb-6 text-center ${success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} border`}>
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center py-6">جاري التسجيل...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="الاسم الكامل" value={name} onChange={(e) => setName(e.target.value)} required className="form-input" />

            <select value={role} onChange={(e) => setRole(e.target.value)} required className="form-input">
              <option value="">اختر نوع الحساب</option>
              <option value="user">طالب</option>
              <option value="teacher">مدرس</option>
            </select>

            <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-input" />

            <input type="tel" placeholder="رقم الهاتف" value={phone} onChange={(e) => setPhone(e.target.value)} required className="form-input" />

            <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-input" />

            {role === 'teacher' && (
              <>
                <input type="text" placeholder="تخصصك (مثلاً: رياضيات، إنجليزي...)" value={subject} onChange={(e) => setSubject(e.target.value)} required className="form-input" />

                <input type="number" placeholder="عدد سنوات الخبرة" value={experience} onChange={(e) => setExperience(e.target.value)} required className="form-input" />

                <input type="file" accept="image/*" ref={imageInputRef} className="form-input" required />
              </>
            )}

            <button type="submit" className="w-full py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold transition-all">
              إنشاء الحساب
            </button>
          </form>
        )}
      </div>

      <style jsx>{`
        .form-input {
          width: 100%;
          padding: 10px 15px;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          background-color: #f9fafb;
          font-size: 15px;
          outline: none;
          transition: all 0.2s;
        }

        .form-input:focus {
          border-color: #4ade80;
          box-shadow: 0 0 0 1px #4ade80;
          background-color: white;
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
