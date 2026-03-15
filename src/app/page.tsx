import Image from 'next/image';
import './globals.css';
import imgHeader from '../../public/img/Header1.png';
import { VscWorkspaceTrusted } from "react-icons/vsc";
import Link from 'next/link';
import Advantages from '../Components/Advantages'
import CardCourse from '../Components/CardCourse'
import Join from '../Components/Join'
import PopularCourses from '../Components/PopularCourses'

export default function Home() {
  return (
    <>
      <div className="bg-[#7CA982] py-12">
        <div className="container mx-auto px-4 ">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            
            {/* Text */}
            <div className="text-white max-w-xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold w-[100%] leading-tight mb-6">
                ابدأ التعلم مع Edu Class
                منصة دورات أونلاين
                لمستقبل أفضل لك
              </h1>

              <p className="mb-6 text-sm md:text-base leading-relaxed">
                تقدم هذه المنصة العديد من الدورات في مجالات مختلفة،
                كما تضم مجموعة من المحاضرين المميزين. منصة تعليمية
                مختلفة تقدم محتوى متنوع بجودة عالية مع تجربة تعلم
                تفاعلية ومستمرة.
              </p>

              <button className="bg-white/30 text-white text-xl font-bold py-3 px-6 duration-300 rounded-lg shadow hover:bg-gray-100 hover:text-[#7CA982] transition mb-6">
                <Link href='/courses'>
                  ابدأ التعلم
                </Link>
              </button>

              <div className="flex gap-4 text-center">
                <div className="flex items-center justify-center">
                  <VscWorkspaceTrusted size={20} className="text-white m-2" />
                  <p className="text-white font-medium">دورات مباشرة</p>
                </div>

                <div className="flex items-center justify-center">
                  <VscWorkspaceTrusted size={20} className="text-white m-2 " />
                  <p className="text-white font-medium">محاضرات صوتية</p>
                </div>

                <div className="flex items-center justify-center">
                  <VscWorkspaceTrusted size={20} className="text-white m-2" />
                  <p className="text-white font-medium">محاضرات مسجلة</p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="w-full lg:w-1/2">
              <Image src={imgHeader} alt="صورة المنصة التعليمية" className="w-full h-auto rounded-lg" priority />
            </div>
          </div>
        </div>
      </div>

      <Advantages/>
      <CardCourse/>
      <Join/>
      <PopularCourses/>
    </>
  );
}