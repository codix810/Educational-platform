"use client";

import React from 'react';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#7CA982] text-white py-10">
      <div className="container mx-auto px-4">

        {/* Upper footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Logo and About */}
          <div>
            <Link href="/" className="text-white font-bold text-3xl  tracking-wide">
                Codi<span className='text-[#8adb9e]'>X</span> 
            </Link>
            <p className='pt-2'>
              CodiX offers various online courses with top instructors to develop your skills and build your future career.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li><Link href="/courses" className="hover:underline">Courses</Link></li>
              <li><Link href="/about" className="hover:underline">About</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
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
