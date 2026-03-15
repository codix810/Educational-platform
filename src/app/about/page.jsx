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
          <h1 className="text-4xl font-bold text-[#7CA982] mb-4">نبذة عن أكاديميتنا</h1>
          <p className="text-gray-700 mb-6 leading-relaxed">
تتمثل مهمتنا في تمكين الطلاب بالمهارات العملية والمعرفة المهنية لإعدادهم لاحتياجات السوق في مجالات التصميم والتطوير والأعمال.
          </p>

          <p className="text-gray-700 mb-6 leading-relaxed">
نقدم دورات عالية الجودة مع أفضل المدربين، وفصول تفاعلية، ومشاريع واقعية لضمان تحقيق كل طالب لأهدافه بكفاءة.
          </p>

          <p className="text-gray-700 mb-6 leading-relaxed">
انضم إلينا اليوم وابدأ رحلتك نحو وظيفة أحلامك من خلال مجموعتنا الواسعة من البرامج والموجهين الخبراء.
          </p>

          <button className="bg-[#7CA982] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#6b8f75] transition">
استكشف البرامج
          </button>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
