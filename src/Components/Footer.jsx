"use client";

import React from 'react';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa";
import { AcademicCapIcon} from '@heroicons/react/24/outline';
const Footer = () => {
  return (
    <footer className="bg-[#7CA982] text-white py-10">
      <div className="container mx-auto px-4">

        {/* Upper footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Logo and About */}
          <div>
                  <Link href="/" className="group flex items-center gap-2">
                    <div className="p-2 bg-white rounded-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
                      <AcademicCapIcon className="w-8 h-8 text-[#4F772D]" />
                    </div>
                    <span className="text-white font-black text-4xl tracking-tighter">
                      Codi<span className="text-[#ECF394] group-hover:animate-pulse">X</span>
                    </span>
                  </Link>
            <p className='pt-2'>
تقدم CodiX دورات تدريبية متنوعة عبر الإنترنت مع نخبة من المدربين لتطوير مهاراتك وبناء مستقبلك المهني.
            </p>
          </div>






          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:underline">الرئيسيه</Link></li>
              <li><Link href="/courses" className="hover:underline">الدورات</Link></li>
              <li><Link href="/about" className="hover:underline">عنا</Link></li>
              <li><Link href="/contact" className="hover:underline">اتصال</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-semibold mb-4">تابعنا</h3>
            <div className="flex space-x-4">
              <Link href="#"><FaFacebookF className="text-2xl hover:text-gray-200 transition" /></Link>
              <Link href="#"><FaInstagram className="text-2xl hover:text-gray-200 transition" /></Link>
              <Link href="#"><FaYoutube className="text-2xl hover:text-gray-200 transition" /></Link>
              {/* <Link href="#"><FaLinkedinIn className="text-2xl hover:text-gray-200 transition" /></Link> */}
            </div>
          </div>

        </div>

        {/* Bottom footer */}
        <div className="border-t border-white pt-4 text-center">
          <p>© {new Date().getFullYear()} CodiX. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
