// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const url = request.nextUrl;

  const isAdminPath = url.pathname.startsWith('/dashboard');

  if (isAdminPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAdminPath && token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (err) {
      console.error('JWT Verify Error:', err);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/addcourse', '/devices'],
};
