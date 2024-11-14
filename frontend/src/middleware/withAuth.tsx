'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function withAuth(WrappedComponent: React.ComponentType<any>) {
  return function AuthComponent(props: any) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            router.push('/login');
            return;
          }

          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          if (!apiUrl) {
            throw new Error('Backend API URL is not configured');
          }

          const response = await fetch(`${apiUrl}/api/auth/check`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error('Authentication check failed');
          }

          setIsLoading(false);
        } catch (error) {
          console.error('Auth check error:', error);
          localStorage.removeItem('token');
          router.push('/login');
        }
      };

      checkAuth();
    }, [router]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}
