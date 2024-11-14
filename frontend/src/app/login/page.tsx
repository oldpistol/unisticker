'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        // First check if we have a token
        const token = localStorage.getItem('token');
        if (!token) {
          return; // No token, user needs to login
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

        if (response.ok) {
          // User is authenticated, redirect to applications page
          router.push('/applications');
        } else {
          // Token is invalid, remove it
          localStorage.removeItem('token');
        }
      } catch (error) {
        // If there's an error checking auth status, remove the token
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    // Check for success message in URL
    const success = searchParams.get('success');
    const message = searchParams.get('message');
    if (success === 'true' && message) {
      setSuccessMessage(message);
      // Clear success message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const validateEmail = (email: string) => {
    const utmDomains = ['graduate.utm.my', 'live.utm.my'];
    const emailDomain = email.split('@')[1];
    return utmDomains.includes(emailDomain);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData({ ...formData, email });
    
    if (email && !validateEmail(email)) {
      setEmailError('Please use your UTM student email (@graduate.utm.my or @live.utm.my)');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      setEmailError('Please use your UTM student email (@graduate.utm.my or @live.utm.my)');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      if (!apiUrl) {
        throw new Error('Backend API URL is not configured');
      }

      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store the token
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Redirect to applications page
      router.push('/applications');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    router.push('/applications');
  };

  const handleMicrosoftSignIn = () => {
    router.push('/applications');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with Text Logo */}
      <div className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-500">
                UniSticker
              </span>
            </div>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors shadow-none sm:shadow-sm"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-5xl w-full px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-none sm:rounded-2xl shadow-none sm:shadow-xl overflow-hidden mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left Side - Login Form */}
              <div className="px-4 py-6 sm:p-12 lg:p-12">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                  <div className="space-y-6">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                      Sign in to your account
                    </h1>

                    {successMessage && (
                      <div className="rounded-md bg-green-50 p-4">
                        <div className="flex">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-green-800">
                              {successMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                              {error}
                            </h3>
                          </div>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <div className="mt-1">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={formData.email}
                            onChange={handleEmailChange}
                            className={`block w-full appearance-none rounded-lg border ${
                              emailError ? 'border-red-300' : 'border-gray-300'
                            } px-3 py-2.5 shadow-none sm:shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition-colors`}
                            placeholder="student@graduate.utm.my"
                          />
                          {emailError && (
                            <p className="mt-2 text-sm text-red-600">
                              {emailError}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                          Password
                        </label>
                        <div className="mt-1">
                          <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2.5 shadow-none sm:shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition-colors"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end">
                        <Link
                          href="/forgot-password"
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || !!emailError}
                        className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-none sm:shadow-sm"
                      >
                        {isLoading ? (
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          'Sign in'
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Right Side - SSO Options */}
              <div className="bg-gray-50 px-4 py-6 sm:p-12 lg:p-12 flex items-center">
                <div className="mx-auto w-full max-w-sm">
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Or continue with
                    </h2>
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="group relative flex justify-center items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors shadow-none sm:shadow-sm"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                          <path fill="#f35325" d="M1 1h10v10H1z"/>
                          <path fill="#81bc06" d="M12 1h10v10H12z"/>
                          <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                          <path fill="#ffba08" d="M12 12h10v10H12z"/>
                        </svg>
                        Google
                      </button>

                      <button
                        type="button"
                        onClick={handleMicrosoftSignIn}
                        className="group relative flex justify-center items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors shadow-none sm:shadow-sm"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 23 23">
                          <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                          <path fill="#f35325" d="M1 1h10v10H1z"/>
                          <path fill="#81bc06" d="M12 1h10v10H12z"/>
                          <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                          <path fill="#ffba08" d="M12 12h10v10H12z"/>
                        </svg>
                        Microsoft
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
