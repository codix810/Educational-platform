// @ts-ignore
'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import Sidebar from './components/Sidebar';
import InfoSection from './components/InfoSection';
import WalletSection from './components/WalletSection';
import CoursesSection from './components/CoursesSection';
import LevelSection from './components/LevelSection';

type UserType = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  image?: string;
  [key: string]: any;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', image: '' });
  const [section, setSection] = useState<'info' | 'wallet' | 'courses' | 'level'>('info');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [paymentOption, setPaymentOption] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const savedUser = localStorage.getItem('user');
      if (!savedUser) return router.push('/Login');
      const parsedUser: UserType = JSON.parse(savedUser);
      if (!parsedUser._id) return router.push('/Login');

      const res = await fetch(`/api/users/${parsedUser._id}`);
      const data = await res.json();
      setUser(data);
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone,
        image: data.image || '',
      });
      setLoading(false);
    };
    fetchUserData();
  }, [router]);

  const showMessage = (msg: string, type: string) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData({ ...formData, image: URL.createObjectURL(file) });
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setUser((prev) => (prev ? { ...prev, ...formData } : null));
        setEditing(false);
        showMessage('✅ تم حفظ التعديلات بنجاح', 'success');
      } else {
        showMessage(data.message, 'error');
      }
    } catch (err) {
      showMessage('❌ فشل حفظ التعديلات', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/Login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <motion.div
          className="flex gap-2"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#EEF1EF]">
      <Sidebar currentSection={section} onSectionChange={setSection} />

      <main className="flex-1 p-6 md:p-10 transition-all">
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 p-3 rounded text-center transition-all shadow-lg text-sm font-medium ${
              messageType === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message}
          </motion.div>
        )}

        {section === 'info' && (
          <InfoSection
            user={user}
            formData={formData}
            setFormData={setFormData}
            editing={editing}
            setEditing={setEditing}
            handleInputChange={handleInputChange}
            handleImageChange={handleImageChange}
            handleSave={handleSave}
            handleLogout={handleLogout}
          />
        )}

        {section === 'wallet' && (
          <WalletSection
            paymentOption={paymentOption}
            setPaymentOption={setPaymentOption}
          />
        )}

        {section === 'courses' && <CoursesSection />}
        {section === 'level' && <LevelSection />}
      </main>
    </div>
  );
}
