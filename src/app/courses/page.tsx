// @ts-ignore
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [search, setSearch] = useState('');
  const [successAnimation, setSuccessAnimation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const savedUser = localStorage.getItem('user');
      if (!savedUser) return router.push('/Login');
      const parsed = JSON.parse(savedUser);

      const userRes = await fetch(`/api/users/${parsed._id}`);
      const freshUser = await userRes.json();
      setUser(freshUser);

      const coursesRes = await fetch('/api/courses');
      const coursesData = await coursesRes.json();
      setCourses(coursesData.courses || []);

      setLoading(false);
    };

    fetchData();
  }, [router]);


const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
  setMessage({ text, type });
  setTimeout(() => setMessage({ text: '', type: '' }), 3000);
};

  const handleBuy = async () => {
    if (!selectedCourse || !user) return;

    const hasPurchased = await fetch(`/api/purchases`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, courseId: selectedCourse._id })
    });
    const result = await hasPurchased.json();

    setModalOpen(false); // close modal first

    if (result.exists) {
      setTimeout(() => {
        showMessage('لقد قمت بشراء هذا الكورس من قبل.', 'error');
      }, 200);
      return;
    }

    if (user.balance < selectedCourse.price) {
      showMessage('رصيدك غير كافي لشراء هذا الكورس.', 'error');
      return;
    }

    const purchaseRes = await fetch(`/api/purchases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user._id,
        courseId: selectedCourse._id,
        price: selectedCourse.price
      })
    });

    if (purchaseRes.ok) {
      const updatedUser = await fetch(`/api/users/${user._id}`).then((res) => res.json());
      setUser(updatedUser);
      setSuccessAnimation(true);
      setTimeout(() => setSuccessAnimation(false), 4000);
    } else {
      showMessage('❌ حدث خطأ أثناء الشراء.', 'error');
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">الكورسات المتاحة</h1>

      {user && (
        <div className="text-center text-gray-700 mb-6">
          <span className="font-medium text-lg">رصيدك الحالي: </span>
          <span className="text-green-600 font-bold">{user.balance} جنيه</span>
        </div>
      )}

      <div className="mb-8 flex justify-center">
        <input
          type="text"
          placeholder="ابحث عن كورس..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring focus:border-green-400"
        />
      </div>

      <AnimatePresence>
        {message.text && (
          <motion.div
            className={`flex items-center gap-3 justify-center mb-6 p-3 rounded-md text-white font-medium shadow-md ${
              message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {successAnimation && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white p-6 rounded-xl shadow-xl text-center max-w-md mx-auto"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <h2 className="text-2xl font-bold text-green-700 mb-2"> مبروك!</h2>
            <p className="text-gray-700 mb-4">تم شراء الكورس بنجاح، استمتع بمشاهدته </p>
            <button
              onClick={() => setSuccessAnimation(false)}
              className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded shadow"
            >
              مشاهدة الكورسات
            </button>
            
          </motion.div>
        </motion.div>
      )}

      {modalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-sm text-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <h2 className="text-lg font-bold mb-4 text-gray-800">هل أنت متأكد من شراء الكورس؟</h2>
            <p className="mb-2 text-gray-600">رصيدك الحالي: {user?.balance} جنيه</p>
            <p className="text-gray-800 font-medium mb-4">سعر الكورس: {selectedCourse?.price} جنيه</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
              >
                إلغاء
              </button>
              <button
                onClick={handleBuy}
                className={`px-4 py-2 rounded text-white transition ${
                  user?.balance < selectedCourse?.price
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
                disabled={user?.balance < selectedCourse?.price}
              >
                تأكيد الشراء
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <motion.div
            key={course._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition border"
          >
            <img
              src={course.image || '/uploads/default.png'}
              alt={course.title}
              className="w-full h-40 object-cover rounded mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{course.description}</p>
            <p className="text-md font-bold text-green-700 mb-4">{course.price} جنيه</p>
            <button
              onClick={() => {
                setSelectedCourse(course);
                setModalOpen(true);
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded transition"
            >
              شراء الكورس
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
