'use client';

import Link from 'next/link';
import { useState } from 'react';

type IdentificationType = 'ic' | 'passport';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    identificationType: 'ic' as IdentificationType,
    identificationNumber: '',
    matricNumber: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailParts = email.split('@');
    if (emailParts.length !== 2) return false;
    const domain = emailParts[1];
    return domain.endsWith('.utm.my');
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateIdentificationNumber = (id: string, type: IdentificationType) => {
    if (type === 'ic') {
      return /^\d{12}$/.test(id);
    }
    return id.length > 0;
  };

  const validateMatricNumber = (matricNumber: string) => {
    return /^[A-Z]\d{2}[A-Z]{2}\d{4}$/.test(matricNumber);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setFormData({ ...formData, email });
    
    if (email && !validateEmail(email)) {
      setEmailError('Please use your UTM email (example: student@graduate.utm.my)');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });

    if (password && !validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters long');
    } else {
      setPasswordError('');
    }

    if (formData.confirmPassword && password !== formData.confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value;
    setFormData({ ...formData, confirmPassword });

    if (confirmPassword && confirmPassword !== formData.password) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    setFormData({ ...formData, mobileNumber: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <>
      {/* Header */}
      <div className="fixed top-0 w-full bg-white shadow-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-gray-900">
                  UniSticker
                </span>
              </Link>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center pt-16 pb-12 bg-gray-50">
        <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden mx-auto">
            <div className="p-8 lg:p-12">
              {/* Form Header */}
              <div className="text-center mb-10">
                <h1 className="text-3xl font-semibold text-gray-900 mb-3">
                  Create your account
                </h1>
                <p className="text-gray-500">
                  Fill in the information below to create your account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Form Sections Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {/* Personal Information Section */}
                  <div className="space-y-6">
                    <div className="pb-4">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg font-medium mr-3">1</span>
                        Personal Information
                      </h2>
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Full Name
                          </label>
                          <div className="mt-1">
                            <input
                              id="fullName"
                              name="fullName"
                              type="text"
                              spellCheck="false"
                              required
                              value={formData.fullName}
                              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                              className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2.5 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition-colors"
                              placeholder="Enter your full name"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="identificationType" className="block text-sm font-medium text-gray-700">
                            Identification Type
                          </label>
                          <div className="mt-1">
                            <select
                              id="identificationType"
                              name="identificationType"
                              required
                              value={formData.identificationType}
                              onChange={(e) => setFormData({ ...formData, identificationType: e.target.value as IdentificationType })}
                              className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2.5 shadow-none sm:shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition-colors"
                            >
                              <option value="ic">IC Number</option>
                              <option value="passport">Passport</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="identificationNumber" className="block text-sm font-medium text-gray-700">
                            {formData.identificationType === 'ic' ? 'IC Number' : 'Passport Number'}
                          </label>
                          <div className="mt-1">
                            <input
                              id="identificationNumber"
                              name="identificationNumber"
                              type="text"
                              required
                              value={formData.identificationNumber}
                              onChange={(e) => setFormData({ ...formData, identificationNumber: e.target.value })}
                              className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2.5 shadow-none sm:shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="matricNumber" className="block text-sm font-medium text-gray-700">
                            Matric Number
                          </label>
                          <div className="mt-1">
                            <input
                              id="matricNumber"
                              name="matricNumber"
                              type="text"
                              required
                              value={formData.matricNumber}
                              onChange={(e) => setFormData({ ...formData, matricNumber: e.target.value.toUpperCase() })}
                              className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2.5 shadow-none sm:shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition-colors uppercase"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                            Mobile Number
                          </label>
                          <div className="mt-1">
                            <input
                              id="mobileNumber"
                              name="mobileNumber"
                              type="tel"
                              required
                              value={formData.mobileNumber}
                              onChange={handleMobileChange}
                              className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2.5 shadow-none sm:shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition-colors"
                              placeholder="0123456789"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Information Section */}
                  <div className="space-y-6">
                    <div className="pb-4 md:border-l md:pl-12">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg font-medium mr-3">2</span>
                        Account Information
                      </h2>
                      <div className="space-y-6">
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
                              <p className="mt-1.5 text-xs text-red-600">
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
                              autoComplete="new-password"
                              required
                              value={formData.password}
                              onChange={handlePasswordChange}
                              className={`block w-full appearance-none rounded-lg border ${
                                passwordError ? 'border-red-300' : 'border-gray-300'
                              } px-3 py-2.5 shadow-none sm:shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition-colors`}
                            />
                            {passwordError && (
                              <p className="mt-1.5 text-xs text-red-600">
                                {passwordError}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                          </label>
                          <div className="mt-1">
                            <input
                              id="confirmPassword"
                              name="confirmPassword"
                              type="password"
                              autoComplete="new-password"
                              required
                              value={formData.confirmPassword}
                              onChange={handleConfirmPasswordChange}
                              className={`block w-full appearance-none rounded-lg border ${
                                confirmPasswordError ? 'border-red-300' : 'border-gray-300'
                              } px-3 py-2.5 shadow-none sm:shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition-colors`}
                            />
                            {confirmPasswordError && (
                              <p className="mt-1.5 text-xs text-red-600">
                                {confirmPasswordError}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button Section */}
                <div className="pt-6">
                  <div className="bg-gray-50 -mx-8 -mb-8 lg:-mx-12 lg:-mb-12 px-8 py-6 lg:px-12 lg:py-8 border-t">
                    <button
                      type="submit"
                      disabled={
                        !formData.fullName ||
                        !formData.identificationNumber ||
                        !formData.matricNumber ||
                        !formData.mobileNumber ||
                        !formData.email ||
                        !formData.password ||
                        !formData.confirmPassword ||
                        Boolean(emailError) ||
                        Boolean(passwordError) ||
                        Boolean(confirmPasswordError) ||
                        !validateIdentificationNumber(formData.identificationNumber, formData.identificationType) ||
                        !validateMatricNumber(formData.matricNumber)
                      }
                      className="flex w-full justify-center rounded-lg bg-indigo-600 px-8 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      Create account
                    </button>
                    <p className="mt-4 text-center text-sm text-gray-500">
                      Already have an account?{' '}
                      <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
