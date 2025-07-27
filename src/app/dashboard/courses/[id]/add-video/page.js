'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminGuard } from '../../../../../../hooks/useAdminGuard';
import {ArrowLeft,} from 'lucide-react';

export default function AddVideoPage() {
  useAdminGuard(); //  حماية الأدمن فقط

  const router = useRouter();
  const { id: courseId } = useParams();

  const [title, setTitle] = useState('');
  const [order, setOrder] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) return showToast('❌ الرجاء اختيار فيديو', 'error');

    setLoading(true);

    try {
      //  رفع الفيديو إلى Cloudinary
      const formData = new FormData();
      formData.append('file', videoFile);
      formData.append('upload_preset', 'unsigned_dashboard');
      formData.append('folder', 'dashboard_videos');
      formData.append('resource_type', 'video');

      const cloudRes = await fetch(
        'https://api.cloudinary.com/v1_1/dfbadbos5/video/upload',
        { method: 'POST', body: formData }
      );

      const cloudData = await cloudRes.json();

      if (!cloudRes.ok || !cloudData.secure_url) {
        throw new Error('فشل رفع الفيديو إلى Cloudinary');
      }


 const result = await fetch('/api/videos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title,
    url: cloudData.secure_url,
    order,
    duration: formatDuration(cloudData.duration),
    courseId,
    public_id: cloudData.public_id, //  هذا صحيح ويجب أن يصل للباك
  }),
});
if (!result.ok) {
  const errorData = await result.json();
  throw new Error(errorData.message || 'فشل في حفظ الفيديو');
}

      showToast(' تم إضافة الفيديو بنجاح', 'success');
      setTimeout(() => router.push('/dashboard/videos'), 2000);
    } catch (err) {
      showToast(err.message || ' حدث خطأ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}m ${s}s`;
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  return (
    <>
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white
              ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-500'}
            `}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800"> إضافة فيديو للكورس</h2>
        <button
          onClick={() => router.back()}
          className="flex items-center bg-[white] hover:bg-[#f4f4f4] text-[#00695C] ">
          <ArrowLeft className="w-4 h-4" /> رجوع
        </button>
      </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm text-gray-700">
          <div>
            <label className="block mb-1 font-medium">عنوان الفيديو</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-2 border rounded-md focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">رقم الترتيب</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              required
              className="w-full p-2 border rounded-md focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">اختيار الفيديو</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              required
              className="w-full p-2 border rounded-md focus:ring focus:border-blue-300"
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className={`w-full py-2 rounded-md font-semibold text-white transition ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {loading ? 'جاري الإرسال...' : ' حفظ الفيديو'}
          </motion.button>
        </form>
      </motion.div>
    </>
  );
}
