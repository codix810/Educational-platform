'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function EditVideoPage() {
  const router = useRouter();
  const { id: videoId } = useParams();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return router.push('/not-found.js');
    const user = JSON.parse(userData);
    if (user.role !== 'admin') return router.push('/not-found.js');
  }, [router]);

  useEffect(() => {
const fetchVideo = async () => {
  try {
    const res = await fetch(`/api/videos/${videoId}`);
    const data = await res.json();


    setVideo(data.video); // ✅ ده المهم
    setLoading(false);
  } catch (err) {
    console.error('❌ Error fetching video:', err);
  }
};


    if (videoId) fetchVideo();
  }, [videoId]);

  const handleChange = (e) => {
    setVideo({ ...video, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const { _id, ...updatedVideo } = video;

  try {
    const res = await fetch(`/api/videos/${videoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedVideo),
    });

    if (res.ok) {
      router.push('/dashboard/videos');
    } else {
      const errorText = await res.text();
      alert('❌ فشل في التعديل: ' + errorText);
    }
  } catch (err) {
    console.error('❌ Error submitting update:', err);
    alert('❌ حصل خطأ أثناء التعديل');
  }
};



  if (loading || !video) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto mt-10 p-6 bg-[#F0F4F8] rounded-2xl shadow text-gray-800"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-[#374151]">
        تعديل بيانات الفيديو
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block mb-1 font-medium"> العنوان</label>
          <input
            type="text"
            name="title"
            value={video.title || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
          <div>
          <label className="block mb-1 font-medium"> الدور</label>
          <input
            type="text"
            name="order"
            value={video.order || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium"> المدة</label>
          <input
            type="text"
            name="duration"
            value={video.duration || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            readOnly
          />
        </div>

        <div>
          <label className="block mb-1 font-medium"> رابط الفيديو</label>
          <input
            type="text"
            name="url"
            value={video.url || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            readOnly
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-[#A7D7C5] text-black font-semibold py-2 rounded-md hover:bg-[#8DC6AF] transition"
        >
          حفظ التعديلات
        </motion.button>
      </form>
    </motion.div>
  );
}
