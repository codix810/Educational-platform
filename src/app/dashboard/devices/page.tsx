'use client';

import { motion } from 'framer-motion';
import React from 'react';

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mb-4 text-gray-800">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            تأكيد
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = React.useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const confirmAction = () => {
    // هنا تحط الكود اللي عايز تنفذه لما المستخدم يأكد
    alert('تم تأكيد العملية!');
    closeModal();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">لوحة التحكم</h1>

      <button
        onClick={openModal}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        افتح التأكيد
      </button>

      <ConfirmModal
        isOpen={modalOpen}
        onClose={closeModal}
        onConfirm={confirmAction}
        message="هل أنت متأكد من تنفيذ هذه العملية؟"
      />
    </div>
  );
}
