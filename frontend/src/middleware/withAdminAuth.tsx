'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function withAdminAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAdminAuthComponent(props: P) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const token = localStorage.getItem('admin_token');
          
          if (!token) {
            throw new Error('No token found');
          }

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/auth/check`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Authentication failed');
          }

          const data = await response.json();
          
          if (!data.authenticated) {
            throw new Error('Not authenticated');
          }

          setIsAuthenticated(true);
        } catch (error) {
          toast.error('Please login to access this page');
          router.push('/admin/login');
        }
      };

      checkAuth();
    }, [router]);

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}