'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Lock, Mail, Phone, FileText } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50/30">
      {/* Header */}
      <div className="fixed top-0 w-full bg-white shadow-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/login" className="flex items-center">
              <span className="text-xl font-bold text-indigo-900">
                UniSticker
              </span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-indigo-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Fill in the information below to create your account
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-400" />
                Personal Information
              </h2>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="identificationType" className="block text-sm font-medium text-gray-700">
                      Identification Type
                    </label>
                    <select
                      id="identificationType"
                      name="identificationType"
                      required
                      value={formData.identificationType}
                      onChange={(e) => setFormData({ ...formData, identificationType: e.target.value as IdentificationType })}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="ic">IC Number</option>
                      <option value="passport">Passport</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="identificationNumber" className="block text-sm font-medium text-gray-700">
                      {formData.identificationType === 'ic' ? 'IC Number' : 'Passport Number'}
                    </label>
                    <input
                      type="text"
                      id="identificationNumber"
                      name="identificationNumber"
                      required
                      value={formData.identificationNumber}
                      onChange={(e) => setFormData({ ...formData, identificationNumber: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="matricNumber" className="block text-sm font-medium text-gray-700">
                      Matric Number
                    </label>
                    <input
                      type="text"
                      id="matricNumber"
                      name="matricNumber"
                      required
                      value={formData.matricNumber}
                      onChange={(e) => setFormData({ ...formData, matricNumber: e.target.value.toUpperCase() })}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm uppercase"
                    />
                  </div>

                  <div>
                    <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      id="mobileNumber"
                      name="mobileNumber"
                      required
                      value={formData.mobileNumber}
                      onChange={handleMobileChange}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="0123456789"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-gray-400" />
                Account Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleEmailChange}
                    className={`mt-1 block w-full rounded-lg border ${
                      emailError ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                    placeholder="student@graduate.utm.my"
                  />
                  {emailError && (
                    <p className="mt-1.5 text-xs text-red-600">{emailError}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handlePasswordChange}
                      className={`mt-1 block w-full rounded-lg border ${
                        passwordError ? 'border-red-300' : 'border-gray-300'
                      } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                    />
                    {passwordError && (
                      <p className="mt-1.5 text-xs text-red-600">{passwordError}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      className={`mt-1 block w-full rounded-lg border ${
                        confirmPasswordError ? 'border-red-300' : 'border-gray-300'
                      } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                    />
                    {confirmPasswordError && (
                      <p className="mt-1.5 text-xs text-red-600">{confirmPasswordError}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button Section */}
            <div className="bg-gray-50 rounded-lg p-6 border">
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
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
          </form>
        </div>
      </main>
    </div>
  );
}
