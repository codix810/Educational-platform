'use client';

import Link from 'next/link';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  AcademicCapIcon,
  Squares2X2Icon,
  HomeIcon,
  BookOpenIcon,
  InformationCircleIcon,
  DocumentCheckIcon,
  ShoppingCartIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState, Fragment } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type UserType = {
  role: 'admin' | 'teacher' | 'user';
  name?: string;
  _id?: string;
};

export default function Navbar() {
  const [user, setUser] = useState<UserType | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // حالة شفافة عند بداية الصفحة وتتغير عند السكرول
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return <div className="h-20 bg-[#7CA982]"></div>;

  const role = user?.role ?? 'visitor';
  const isAdmin = role === 'admin';
  const isTeacher = role === 'teacher';
  const isUser = role === 'user';
  const isVisitor = role === 'visitor';

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };
const getLinks = () => {

  const common = [
    { name: 'الرئيسية', href: '/', icon: HomeIcon },
    { name: 'الكورسات', href: '/courses', icon: BookOpenIcon },
  ];

  if (isAdmin) {
    return [
      ...common,
      { name: 'لوحة التحكم', href: '/dashboard', icon: Squares2X2Icon },
      { name: 'المشتريات', href: '/dashboard/purchases', icon: ShoppingCartIcon  },
      { name: 'الامتحانات', href: '/dashboard/exam-results', icon: DocumentCheckIcon },
    ];
  }

  if (isTeacher) {
    return [
      ...common,
      { name: 'كورساتي', href: '/teacher/courses', icon: AcademicCapIcon },
    ];
  }

  if (isUser) {
    return [
      ...common,
      { name: 'كورساتي', href: '/my-courses', icon: AcademicCapIcon },
    ];
  }

  return [
    ...common,
    { name: 'المدرسين', href: '/mentors', icon: UsersIcon },
    { name: 'عن المنصة', href: '/about', icon: InformationCircleIcon },
  ];
};
  const navLinks = getLinks();

  return (
    <Disclosure as="nav" className="sticky top-0 z-50 transition-all duration-500">
      {({ open,close  }) => (
        <>
          {/* خلفية الناف بار مع تدريج الألوان المطلوب والأنيميشن */}
          <div className={`
            transition-all duration-500 ease-in-out border-b
            ${isScrolled 
              ? 'bg-[#7CA982]/95 backdrop-blur-lg shadow-xl py-2 border-white/20' 
              : 'bg-gradient-to-r from-[#7CA982] via-[#8BB691] to-[#9BC2A1] py-4 border-transparent'}
          `}>
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex h-16 items-center justify-between">
                
                {/* Logo Section */}
                <Link href="/" className="group flex items-center gap-3">
                  <div className="p-2 bg-white/90 rounded-2xl shadow-md group-hover:rotate-[360deg] transition-all duration-700">
                    <AcademicCapIcon className="w-8 h-8 text-[#7CA982]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-black text-2xl tracking-tight leading-none">
                      Codi<span className="text-[#DDEFD6]">X</span>
                    </span>
                    <span className="text-white/80 text-[10px] font-bold tracking-[0.2em] uppercase">Academy</span>
                  </div>
                </Link>

                {/* Desktop Links with Hover Animation */}
                <div className="hidden lg:flex items-center gap-2">
                  {navLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`relative group px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2
                        ${isActive 
                          ? 'bg-white text-[#7CA982] shadow-lg' 
                          : 'text-white hover:bg-white/10'}`}
                      >
                        {Icon && <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-[#7CA982]' : 'text-white/80'}`} />}
                        {item.name}
                        {!isActive && (
                          <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-[#DDEFD6] transition-all duration-300 group-hover:w-1/2 group-hover:left-1/4"></span>
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Auth & Profile Buttons */}
                <div className="hidden lg:flex items-center gap-4">
                  {isVisitor ? (
                    <div className="flex items-center gap-4">
                      <Link href="/Login" className="text-white font-bold hover:text-[#DDEFD6] transition-colors">دخول</Link>
                      <Link
                        href="/Signup"
                        className="bg-white text-[#7CA982] px-6 py-2.5 rounded-full font-black shadow-md hover:bg-[#DDEFD6] hover:text-[#5B7B60] hover:-translate-y-1 active:scale-95 transition-all duration-300"
                      >
                        ابدأ الآن
                      </Link>
                    </div>
                  ) : (
                    <Menu as="div" className="relative">
                      <Menu.Button className="flex items-center gap-3 bg-white/10 hover:bg-white/20 p-1 pl-4 rounded-full border border-white/30 transition-all">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-inner overflow-hidden">
                          <UserIcon className="w-6 h-6 text-[#7CA982]" />
                        </div>
                        <p className="text-white font-bold text-sm">{user?.name}</p>
                      </Menu.Button>

                      <Transition
                        as={Fragment}
                        enter="transition duration-300 ease-out"
                        enterFrom="opacity-0 translate-y-4"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition duration-200 ease-in"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-4"
                      >
<Menu.Items className="absolute right-0 mt-4 w-64 max-w-[90vw] bg-white rounded-3xl shadow-2xl p-3 border border-gray-100 focus:outline-none origin-top-right">                          <div className="px-4 py-3 mb-2 bg-[#7CA982]/10 rounded-2xl">
                             <p className="text-[10px] text-[#7CA982] font-black uppercase">مرحباً بك</p>
                             <p className="text-[#5B7B60] font-bold truncate">{user?.name}</p>
                          </div>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href={isAdmin ? '/dashboard' : isTeacher ? `/teacherprofile` : `/profile`}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all
                                ${active ? 'bg-[#7CA982] text-white' : 'text-slate-600'}`}
                              >
                                <UserCircleIcon className="w-5 h-5" />
                                الملف الشخصي
                              </Link>
                            )}
                          </Menu.Item>
                          <div className="h-px bg-gray-100 my-2 mx-2" />
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-bold transition-all
                                ${active ? 'bg-red-50 text-red-600' : 'text-red-400'}`}
                              >
                                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                تسجيل الخروج
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  )}
                </div>

                {/* Mobile Button */}
<div className="lg:hidden flex items-center gap-2">

  {/* Account Button */}
  {!isVisitor && (
    <Menu as="div" className="relative">
      <Menu.Button className="p-2 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all active:scale-90">
        <UserIcon className="w-6 h-6" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition duration-200 ease-out"
        enterFrom="opacity-0 translate-y-3 scale-95"
        enterTo="opacity-100 translate-y-0 scale-100"
        leave="transition duration-150 ease-in"
        leaveFrom="opacity-100 translate-y-0 scale-100"
        leaveTo="opacity-0 translate-y-3 scale-95"
      >
<Menu.Items className="absolute right-0 mt-3 w-56 max-w-[92vw] bg-white rounded-2xl shadow-xl p-2 border border-gray-100 origin-top-right">          <div className="px-3 py-2 mb-1 bg-[#7CA982]/10 rounded-xl">
            <p className="text-xs text-[#7CA982] font-bold">مرحباً</p>
            <p className="text-sm text-slate-700 font-bold truncate">{user?.name}</p>
          </div>

          <Menu.Item>
            {({ active }) => (
              <Link
                href={isAdmin ? '/dashboard' : isTeacher ? '/teacherprofile' : '/profile'}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold
                ${active ? 'bg-[#7CA982] text-white' : 'text-slate-600'}`}
              >
                <UserCircleIcon className="w-5 h-5" />
                الملف الشخصي
              </Link>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-bold
                ${active ? 'bg-red-50 text-red-600' : 'text-red-400'}`}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                خروج
              </button>
            )}
          </Menu.Item>

        </Menu.Items>
      </Transition>
    </Menu>
  )}

  {/* Mobile Menu Button */}
  <Disclosure.Button className="p-2 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all active:scale-90">
    {open  ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
  </Disclosure.Button>

</div>
              </div>
            </div>

            {/* Mobile Menu Panel */}
            <Transition
              enter="transition duration-300 ease-out"
              enterFrom="opacity-0 -translate-y-10"
              enterTo="opacity-100 translate-y-0"
              leave="transition duration-200 ease-in"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 -translate-y-10"
            >
              <Disclosure.Panel className="lg:hidden bg-white/95 backdrop-blur-xl">
                <div className="px-6 py-8 space-y-3">
                  {navLinks.map((item) => (
<Link
  key={item.name}
  href={item.href}
  onClick={() => close()}
  className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all
  ${pathname === item.href ? 'bg-[#7CA982] text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}
>
                      {item.icon && <item.icon className="w-6 h-6 opacity-70" />}
                      {item.name}
                    </Link>
                  ))}
                  {!isVisitor && (
                    <button 
onClick={() => {
  handleLogout();
  close();
}}                      className="w-full text-right px-6 py-4 rounded-2xl font-bold text-red-400 bg-red-50 flex items-center gap-4"
                    >
                      <ArrowRightOnRectangleIcon className="w-6 h-6" />
                      خروج
                    </button>
                  )}
                </div>
              </Disclosure.Panel>
            </Transition>
          </div>
        </>
      )}
    </Disclosure>
  );
}