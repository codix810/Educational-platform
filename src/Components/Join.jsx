import Link from 'next/link';
import React from 'react';

const Join = () => {
  return (
    <div className="bg-[#7CA982] py-16">
      <div className="container mx-auto px-20 md:px-24  flex flex-col md:flex-row justify-between items-center text-white">
        
        {/* Text */}
        <div className="mb-6 md:mb-0">
          <h1 className="text-5xl font-bold mb-2">Join Our Course</h1>
          <h3 className="text-lg">To Develop Skills With The Best Instructors</h3>
        </div>
        
        {/* Button */}
        <div>
          <button className="bg-white text-[#7CA982] font-bold px-9 py-6 cursor-pointer rounded-full hover:bg-gray-100 transition">
            <Link href='/courses' className='cursor-pointer '>
               Start Learning
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Join;
