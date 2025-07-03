"use client";

import Link from 'next/link';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import './globals.css';
import type { ReactNode } from 'react';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  type UserType = {
  role: 'admin' | 'user';
  email?: string;
  name?: string;
};

const [user, setUser] = useState<UserType | null>(null);

  const router = useRouter();
  const [activeAdmin, setActiveAdmin] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const isAdmin = user?.role === 'admin';
  const isLoggedIn = !!user && !isAdmin;

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const userLinks = [
    { name: 'كورسات', href: '/courses' },
    { name: 'مرسين', href: '/mentors' },
    { name: 'تواصل معنا', href: '/contact' },
  ];

  const adminLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'AddCourse', href: '/dashboard/AddCourse' },
    { name: 'AddUser', href: '/Signup' },
    { name: 'Devices', href: '/dashboard/devices' },
  ];

  return (
    <html lang="en">
      <body className="bg-[#f3f4f6] font-sans">
        <Disclosure as="nav" className="bg-gradient-to-r from-[#7CA982] to-[#B2CDB9] shadow">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                  <Link href="/" className="text-white font-extrabold text-xl tracking-wide">
                    CodiX
                  </Link>

                  {isAdmin && (
                    <div className="hidden sm:flex gap-4">
                      {adminLinks.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => {
                            setActiveAdmin(item.name);
                            router.push(item.href);
                          }}
                          className={`px-3 py-1 rounded-md font-medium text-sm transition-all duration-300 shadow-md hover:scale-105 ${
                            activeAdmin === item.name
                              ? 'bg-[#edf8ed] text-[#2e5939]'
                              : 'bg-white text-[#3d4d3a] hover:bg-gray-100'
                          }`}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {isLoggedIn && (
                    <div className="hidden sm:flex gap-6 text-sm font-semibold text-white">
                      {userLinks.map((item) => (
                        <Link key={item.name} href={item.href} className="hover:text-gray-200">
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  {!user && (
                    <div className="flex gap-2">
                      <Link
                        href="/Login"
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        تسجيل الدخول
                      </Link>
                      <Link
                        href="/Signup"
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                      >
                        إنشاء حساب
                      </Link>
                    </div>
                  )}

                  {user && (
                    <div className="flex items-center gap-3">
                      <div className="sm:hidden">
                        <Disclosure.Button className="inline-flex items-center p-2 rounded-md text-white">
                          {open ? (
                            <XMarkIcon className="h-6 w-6" />
                          ) : (
                            <Bars3Icon className="h-6 w-6" />
                          )}
                        </Disclosure.Button>
                      </div>

                      <Menu as="div" className="relative">
                        <Menu.Button className="flex items-center bg-white rounded-full p-2 shadow-md">
                          <UserIcon className="h-6 w-6 text-gray-700" />
                        </Menu.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                              <Link
                                href="/profile"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                الملف الشخصي
                              </Link>
                            </Menu.Item>
                            <Menu.Item>
                              <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                تسجيل الخروج
                              </button>
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  )}
                </div>
              </div>

              <Disclosure.Panel className="sm:hidden px-4 pb-3 pt-2 space-y-1 bg-white">
                {isLoggedIn &&
                  userLinks.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as={Link}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}

                {isAdmin &&
                  adminLinks.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as={Link}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <main>{children}</main>
      </body>
    </html>
  );
}
