'use client';

import { motion } from 'framer-motion';

export default function CoursesSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-6 rounded shadow space-y-6"
    >
      <h3 className="text-xl font-bold mb-4">كورساتي</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* نموذج كورس */}
        <div className="bg-[#F0F4F8] p-4 rounded shadow">
          <p className="text-lg font-semibold">كورس تطوير الويب</p>
          <p className="text-sm text-gray-700 mt-2">تاريخ البدء: 2025-07-01</p>
          <p className="text-sm text-gray-700">الحالة: مستمر</p>
        </div>
        {/* يمكنك إضافة كورسات إضافية هنا بنفس الشكل */}
      </div>
    </motion.div>
  );
}
