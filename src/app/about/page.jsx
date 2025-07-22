"use client";

import React from 'react';
import Image from 'next/image';
import AboutImage from '../../../public/img/aboutImage.jpeg'

const AboutPage = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">

        {/* Image Section */}
        <div className="md:w-1/2 w-full">
          <Image
            src={AboutImage}
            alt="About Us"
            className="rounded-lg shadow-lg w-full h-auto object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="md:w-1/2 w-full">
          <h1 className="text-4xl font-bold text-[#7CA982] mb-4">About Our Academy</h1>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Our mission is to empower students with practical skills and professional knowledge to prepare them for the market needs in design, development, and business.
          </p>

          <p className="text-gray-700 mb-6 leading-relaxed">
            We provide high-quality courses with the best instructors, interactive classes, and real-life projects to ensure every student achieves their goals efficiently.
          </p>

          <p className="text-gray-700 mb-6 leading-relaxed">
            Join us today and start your journey towards your dream career with our wide range of programs and expert mentors.
          </p>

          <button className="bg-[#7CA982] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#6b8f75] transition">
            Explore Programs
          </button>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
