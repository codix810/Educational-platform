'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminGuard() {
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');

    if (!userData) {
      console.log('🚫 زائر - تحويل للوجين');
      router.replace('/login');
      return;
    }

    const user = JSON.parse(userData);

    if (user.role !== 'admin') {
      console.log('🚫 مش أدمن - تحويل للرئيسية');
      router.replace('/');
    }
  }, []);
}
