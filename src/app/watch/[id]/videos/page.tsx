'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import 'plyr-react/plyr.css';

const Plyr = dynamic(() => import('plyr-react'), { ssr: false });

export default function CourseVideosPage() {
  const { id } = useParams();
  const router = useRouter();
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const topRef = useRef(null);

  useEffect(() => {
    const checkPurchaseAndFetchVideos = async () => {
      const userStr = localStorage.getItem('user');
      if (!userStr) return router.push('/Login');
      const user = JSON.parse(userStr);

      const purchaseCheck = await fetch('/api/purchases', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, courseId: id })
      });
      const check = await purchaseCheck.json();
      if (!check.exists) return router.push('/not-found');

      try {
        const res = await fetch(`/api/videos?courseId=${id}`);
        const data = await res.json();
        setVideos(data.videos || []);
      } catch (error) {
        console.error(' فشل تحميل الفيديوهات:', error);
      } finally {
        setLoading(false);
      }
    };

    checkPurchaseAndFetchVideos();
  }, [id, router]);

  const handlePlay = (video) => {
    setSelectedVideo(video);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          className="flex gap-2"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="px-6 py-10 max-w-7xl mx-auto space-y-10 bg-gradient-to-br from-[#f5f7fa] to-[#e4ecf2] min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6"> فيديوهات الكورس</h1>

      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            ref={topRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200"
          >
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                تشاهد الآن: {selectedVideo.title || 'فيديو'}
            </h2>
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
              <Plyr
                source={{
                  type: 'video',
                  sources: [
                    {
                      src: selectedVideo.url,
                      type: 'video/mp4'
                    }
                  ]
                }}
                options={{
                  controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'fullscreen'],
                  settings: ['quality', 'speed'],
                  disableContextMenu: true
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white shadow rounded-3xl overflow-hidden"
      >
        <table className="w-full text-left">
          <thead className="bg-[#e2e8f0]">
            <tr>
              <th className="py-4 px-6 text-gray-700 text-lg">عنوان الفيديو</th>
              <th className="py-4 px-6 text-gray-700 text-lg">تشغيل</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video, i) => (
              <tr key={i} className="border-t hover:bg-gray-50 transition">
                <td className="py-3 px-6 text-base text-gray-700">{video.title || `فيديو ${i + 1}`}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => handlePlay(video)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow text-sm"
                  >
                    تشغيل الفيديو
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
