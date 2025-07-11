// @ts-ignore
'use client';

import {
  UserIcon,
  BanknotesIcon,
  BookOpenIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

/**
 * @typedef {'info' | 'wallet' | 'courses' | 'level'} SectionType
 */

/**
 * @param {{
 *   currentSection: SectionType,
 *   onSectionChange: (section: SectionType) => void
 * }} props
 */
export default function Sidebar({ currentSection, onSectionChange }) {
  const navItems = [
    { key: 'info', label: 'معلوماتي', icon: UserIcon },
    { key: 'wallet', label: 'محفظتي', icon: BanknotesIcon },
    { key: 'courses', label: 'كورساتي', icon: BookOpenIcon },
    { key: 'level', label: 'مستواي', icon: ChartBarIcon },
  ];

  return (
    <aside className="w-64 bg-[#8BB59B] text-white p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-6">لوحة المستخدم</h2>
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
