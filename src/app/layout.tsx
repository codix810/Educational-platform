import { ReactNode } from 'react';
import './globals.css';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

export const metadata = {
  title: 'CodiX - منصة تعليمية متطورة',
  description: 'تعلم البرمجة والتصميم مع أفضل المدرسين في الوطن العربي',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" >
      <body className="bg-[#F8FAFC] font-sans antialiased text-slate-900">
        
        {/* المكون المستقل للناف بار */}
        <Navbar />

        <main className="min-h-screen relative">
          {/* الخلفية الجمالية المتحركة */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#90A955]/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#ECF394]/10 rounded-full blur-[120px] animate-pulse" />
          </div>

          <div className="relative z-10">
            {children}
          </div>
        </main>

        <Footer />
      </body>
    </html>
  );
}