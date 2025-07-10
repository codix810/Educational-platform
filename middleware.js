// @ts-ignore
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// @ts-ignore
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const url = request.nextUrl;

  const isAdminPath = url.pathname.startsWith('/dashboard');

  if (isAdminPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAdminPath && token) {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      if (decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (err) {
      console.error('❌ JWT Error:', err);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// ✅ هنا نحط الماتشر بتاع المسارات المحمية فقط
export const config = {
  matcher: ['/dashboard/:path*', '/addcourse', '/devices'],
};
