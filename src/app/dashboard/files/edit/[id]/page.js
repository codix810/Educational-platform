//  المسار: src/app/dashboard/files/[id]/page.js 
//ده المساول عن تعديل الملفات
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminGuard } from '../../../../../../hooks/useAdminGuard';
import { motion } from 'framer-motion';
import {ArrowLeft,} from 'lucide-react';


export default function EditFilePage() {

    useAdminGuard(); //  حماية الأدمن فقط

  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const res = await fetch(`/api/files/${id}`);
        const data = await res.json();
        if (res.ok) {
          setFile(data.file);
        } else {
          router.push('/not-found');
        }
      } catch (err) {
        router.push('/not-found');
      } finally {
        setLoading(false);
      }
    };
    fetchFile();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const sizeMB = formData.get('sizeMB');

    try {
      const res = await fetch(`/api/files/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, sizeMB }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ text: ' تم التعديل بنجاح!', type: 'success' });
        setTimeout(() => router.push('/dashboard/files'), 2000);
      } else {
        setMessage({ text: data.message || ' فشل التعديل', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: ' حصل خطأ في الاتصال بالسيرفر', type: 'error' });
    }
  };
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

 

  if (!file) return <div className="text-center mt-10 text-red-500">الملف غير موجود</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white shadow rounded transition-all duration-500">
        <button
          onClick={() => router.back()}
          className="flex items-center bg-[white] hover:bg-[#f4f4f4] text-[#00695C] ">
          <ArrowLeft className="w-4 h-4" /> رجوع
        </button>
    <h1 className="text-2xl font-bold mb-4 text-center">تعديل الملف</h1>
      {message.text && (
        <div
          className={`mb-4 px-4 py-3 rounded transition-all duration-300 ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700 border border-green-400'
              : 'bg-red-100 text-red-700 border border-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">عنوان الملف</label>
          <input
            name="title"
            defaultValue={file.title}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded mt-1 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">الحجم (MB)</label>
          <input
            name="sizeMB"
            type="number"
            defaultValue={file.sizeMB}
            readOnly
            className="w-full border border-gray-300 px-4 py-2 rounded mt-1 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium"> رابط الملف</label>
          <input
            type="text"
            name="url"
            defaultValue={file.url}
            className="w-full border border-gray-300 px-4 py-2 rounded mt-1 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium"> الاسم الاصلي للملف</label>
          <input
            type="text"
            name="url"
            defaultValue={file.originalName}
            className="w-full border border-gray-300 px-4 py-2 rounded mt-1 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            readOnly
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-all duration-200"
        >
          حفظ التعديلات
        </button>
      </form>
    </div>
  );
}




