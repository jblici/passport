'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from './auth';

const ProtectedLayout = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div>
      {children}
    </div>
  );
};

export default ProtectedLayout;