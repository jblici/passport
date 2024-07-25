'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from './auth';

const withAuth = (WrappedComponent) => {
    const AuthComponent = (props) => {
      const router = useRouter();
  
      useEffect(() => {
        if (!getToken()) {
          router.push('/login');
        }
      }, [router]);
  
      return <WrappedComponent {...props} />;
    };
  
    // Asigna un nombre de pantalla para facilitar la depuración
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    AuthComponent.displayName = `withAuth(${displayName})`;
  
    return AuthComponent;
  };
  
  export default withAuth;