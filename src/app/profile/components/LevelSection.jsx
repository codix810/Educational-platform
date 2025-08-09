// @ts-ignore
'use client';

import { motion } from 'framer-motion';

/** 
 * @param {{ loginCount?: number, lastLogin?: string | null }} props 
 */
export default function LevelSection({ loginCount = 0, lastLogin }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-6 rounded shadow space-y-6"
    >
      <h3 className="text-xl font-bold mb-4">Levels</h3>
      <div className="text-sm text-gray-700 space-y-2">
        <p><strong>Number of entries:</strong> {loginCount}</p>
        <p><strong>Last entry:</strong> {lastLogin ? new Date(lastLogin).toLocaleString() : 'unavailable'}</p>
      </div>
      <div className="mt-2">
        <p className="font-semibold mb-1">Entry rate</p>
        <div className="w-full h-4 bg-gray-200 rounded">
          <motion.div
            className="h-full bg-green-500 rounded"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(loginCount, 100)}%` }}
            transition={{ duration: 1 }}
          ></motion.div>
        </div>
      </div>
    </motion.div>
  );
}
