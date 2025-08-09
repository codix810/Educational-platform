// @ts-ignore
'use client';

import {
  UserIcon,
  BanknotesIcon,
  BookOpenIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';

/**
 * @typedef {'info' | 'wallet' | 'courses' | 'level' | 'messages'} SectionType
 */

/**
 * @param {{
 *   currentSection: SectionType,
 *   onSectionChange: (section: SectionType) => void
 * }} props
 */
export default function Sidebar({ currentSection, onSectionChange }) {
  const navItems = [
    { key: 'info', label: 'My Info', icon: UserIcon },
    { key: 'wallet', label: 'Wallet', icon: BanknotesIcon },
    { key: 'courses', label: 'My Courses', icon: BookOpenIcon },
    { key: 'level', label: 'level', icon: ChartBarIcon },
    { key: 'messages', label: 'My messages', icon: ChatBubbleLeftRightIcon }, // زر الرسائل
  ];

  return (
    <aside className="w-64 bg-[#8BB59B] text-white p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-6">User panel</h2>
      <nav className="space-y-2 text-lg">
        {navItems.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onSectionChange(key)}
            className={`flex items-center gap-2 w-full text-right px-2 py-1 rounded hover:bg-white hover:text-[#8BB59B] transition-all ${
              currentSection === key ? 'bg-white text-[#8BB59B]' : ''
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
