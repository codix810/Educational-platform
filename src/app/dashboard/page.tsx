// @ts-ignore
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrashIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  ShieldCheckIcon,
  PrinterIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

type User = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  loginCount?: number;
  password?: string;
};

type Course = {
  _id: string;
  title: string;
  price: number;
  description: string;
  image?: string;
};

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-sm text-center"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <h3 className="text-lg font-bold mb-4 text-gray-800">{message}</h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
          >
            إلغاء
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
          >
            تأكيد
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState<() => void>(() => {});
  const router = useRouter();

  useEffect(() => {
    const loadDashboardData = async () => {
      const savedUser = localStorage.getItem('user');
      if (!savedUser) return router.push('/not-found.js');
      const parsedUser: User = JSON.parse(savedUser);
      if (parsedUser.role !== 'admin') return router.push('/not-found.js');
      setUser(parsedUser);

      const [usersRes, coursesRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/courses'),
      ]);

      const usersData = await usersRes.json();
      const coursesData = await coursesRes.json();

      setUsers(usersData.users || []);
      setCourses((coursesData.courses || []).sort((a: Course, b: Course) => a.price - b.price));
      setLoading(false);
    };

    loadDashboardData();
  }, [router]);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteUser = async (id: string) => {
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    setUsers(users.filter((u) => u._id !== id));
  };

  const deleteCourse = async (id: string) => {
    await fetch(`/api/courses/${id}`, { method: 'DELETE' });
    setCourses(courses.filter((c) => c._id !== id));
  };

  const handlePrint = () => {
    const printable = filteredUsers.map(u => `الاسم: ${u.name}\nالبريد: ${u.email}\nالهاتف: ${u.phone}\nالدور: ${u.role}\n---`).join('\n\n');
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`<pre style="font-family: Arial; padding: 20px">${printable}</pre>`);
      newWindow.document.close();
      newWindow.print();
    }
  };

  if (!user || user.role !== 'admin') return null;

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
    <>
      <ConfirmModal
        isOpen={modalOpen}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
        onConfirm={modalAction}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 max-w-7xl mx-auto text-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">لوحة التحكم</h1>

<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10"
>
  <div className="bg-[#E0F2F1] text-[#00695C] p-4 rounded-lg shadow text-center">
    <p className="text-sm">إجمالي المستخدمين</p>
    <p className="text-2xl font-bold">{users.length}</p>
  </div>
  <div className="bg-[#FFF3E0] text-[#E65100] p-4 rounded-lg shadow text-center">
    <p className="text-sm">عدد الكورسات</p>
    <p className="text-2xl font-bold">{courses.length}</p>
  </div>
  <div className="bg-[#E3F2FD] text-[#1565C0] p-4 rounded-lg shadow text-center">
    <p className="text-sm">إجمالي الدخول</p>
    <p className="text-2xl font-bold">
      {users.reduce((acc, u) => acc + (u.loginCount || 0), 0)}
    </p>
  </div>
  <div className="bg-[#FCE4EC] text-[#AD1457] p-4 rounded-lg shadow text-center">
    <p className="text-sm">عدد الأدمنز</p>
    <p className="text-2xl font-bold">
      {users.filter((u) => u.role === 'admin').length}
    </p>
  </div>
</motion.div>

{/* بحث وطباعة */}
<div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
  <div className="flex items-center gap-2 w-full md:w-1/2">
    <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
    <input
      type="text"
      placeholder="ابحث عن مستخدم بالاسم أو البريد"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 text-sm"
    />
  </div>
  <button
    onClick={handlePrint}
    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow"
  >
    <PrinterIcon className="h-5 w-5" /> طباعة المستخدمين
  </button>
</div>

        {/* المستخدمين */}
        <section className="mb-20 bg-[#F3F6F4] p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">المستخدمين</h2>
              <button onClick={() => router.push(`/Signup`)}className="bg-[#00C853] hover:bg-[#00B342] text-white px-4 py-2 rounded shadow">إضافة مستخدم</button>
            </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse text-gray-700">
              <thead>
                <tr className="bg-gray-100 text-center">
                  <th className="border px-4 py-2">الاسم</th>
                  <th className="border px-4 py-2">البريد</th>
                  <th className="border px-4 py-2">الهاتف</th>
                  <th className="border px-4 py-2">الدور</th>
                  <th className="border px-4 py-2">تم الإنشاء</th>
                  <th className="border px-4 py-2">عدد الدخول</th>
                  <th className="border px-4 py-2">رصيد </th>
                  <th className="border px-4 py-2">كلمة السر</th>
                  <th className="border px-4 py-2">تحكم</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <motion.tr
                    key={u._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center bg-white hover:bg-gray-50 transition"
                  >
                    <td className="border px-4 py-2">{u.name}</td>
                    <td className="border px-4 py-2">{u.email}</td>
                    <td className="border px-4 py-2">{u.phone}</td>
                    <td className="border px-4 py-2">
                      {u.role === 'admin' ? (
                        <div className="flex items-center justify-center gap-1 text-red-600">
                          <ShieldCheckIcon className="h-4 w-4" />
                          أدمن
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1 text-blue-600">
                          <UserIcon className="h-4 w-4" />
                          مستخدم
                        </div>
                      )}
                    </td>
                    <td className="border px-4 py-2">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="border px-4 py-2">{u.loginCount || 0}</td>
                    <td className="border px-4 py-2">{u.balance || 0}</td>
                    <td className="border px-4 py-2 flex items-center justify-center gap-2">
                      {showPassword === u._id ? u.password : '••••'}
                      <button
                        onClick={() => setShowPassword(showPassword === u._id ? null : u._id)}
                        className="text-gray-600 hover:text-blue-600"
                      >
                        {showPassword === u._id ? (
                          <EyeSlashIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="border px-4 py-2">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => {
                            setModalMessage('هل أنت متأكد من تعديل هذا المستخدم؟');
                            setModalAction(() => () => router.push(`/dashboard/edituser/${u._id}`));
                            setModalOpen(true);
                          }}
                          className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 flex gap-1"
                        >
                          <PencilIcon className="h-4 w-4" /> تعديل
                        </button>
                        <button
                          onClick={() => {
                            setModalMessage('هل أنت متأكد من حذف هذا المستخدم؟');
                            setModalAction(() => () => deleteUser(u._id));
                            setModalOpen(true);
                          }}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex gap-1"
                        >
                          <TrashIcon className="h-4 w-4" /> حذف
                        </button>
                        
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
{/* جدول الكورسات */}
  <section className="bg-[#F3F6F4] p-6 rounded-lg shadow">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold">الكورسات</h2>
      <button onClick={() => router.push(`/dashboard/AddCourse`)}className="bg-[#00C853] hover:bg-[#00B342] text-white px-4 py-2 rounded shadow">إضافة كورس</button>
    </div>
  <div className="overflow-x-auto">
    
    <table className="w-full table-auto border-collapse text-gray-700">
      <thead>
        <tr className="bg-gray-100 text-center">
          <th className="border px-4 py-2">العنوان</th>
          <th className="border px-4 py-2">السعر</th>
          <th className="border px-4 py-2">الوصف</th>
          <th className="border px-4 py-2">الصورة</th>
          <th className="border px-4 py-2">تحكم</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => (
          <motion.tr
            key={course._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center bg-white hover:bg-gray-50 transition"
          >
            <td className="border px-4 py-2">{course.title}</td>
            <td className="border px-4 py-2">{course.price}</td>
            <td className="border px-4 py-2">{course.description}</td>
            <td className="border px-4 py-2">
              <img
                src={course.image}
                alt={course.title}
                className="w-20 h-14 rounded object-cover mx-auto"
              />
            </td>
            <td className="border px-4 py-2">
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => {
                    setModalMessage('هل أنت متأكد من تعديل هذا الكورس؟');
                    setModalAction(() => () => router.push(`/dashboard/edit-course/${course._id}`));
                    setModalOpen(true);
                  }}
                  className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 flex gap-1"
                >
                  <PencilIcon className="h-4 w-4" /> تعديل
                </button>
                <button
                  onClick={() => {
                    setModalMessage('هل أنت متأكد من حذف هذا الكورس؟');
                    setModalAction(() => () => deleteCourse(course._id));
                    setModalOpen(true);
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex gap-1"
                >
                  <TrashIcon className="h-4 w-4" /> حذف
                </button>
              </div>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  </div>
</section>

      </motion.div>
    </>
  );
}
