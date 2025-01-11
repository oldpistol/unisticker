'use client';

import { useState, useEffect } from 'react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminMenuBar from '@/components/admin/AdminMenuBar';
import { 
  User,
  Mail, 
  Phone,
  Lock,
  Shield,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { getProfile, updateProfile, updatePassword, ValidationError } from '@/services/adminProfileService';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: string;
}

interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ValidationErrors {
  [key: string]: string[];
}

const VALID_ROLES = ['Super Admin', 'Admin'] as const;
type Role = typeof VALID_ROLES[number];

export default function AdminProfile() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [passwordData, setPasswordData] = useState<PasswordChange>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const profile = await getProfile();
      setProfileData(profile);
    } catch (err) {
      setError('Failed to load profile');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData) return;
    
    setIsLoading(true);
    setError('');
    setValidationErrors({});
    
    try {
      console.log(profileData);
      const { message } = await updateProfile({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        role: profileData.role,
      });
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      if (err.response?.status === 422) {
        const validationError: ValidationError = err.response.data;
        setValidationErrors(validationError.errors);
        setError(validationError.message);
      } else {
        setError(err.response?.data?.message || 'Failed to update profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setValidationErrors({});

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setValidationErrors({
        password_confirmation: ['Passwords do not match']
      });
      setIsLoading(false);
      return;
    }

    try {
      const { message } = await updatePassword({
        current_password: passwordData.currentPassword,
        password: passwordData.newPassword,
        password_confirmation: passwordData.confirmPassword
      });
      setSuccessMessage(message);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      if (err.response?.status === 422) {
        const validationError: ValidationError = err.response.data;
        setValidationErrors(validationError.errors);
        setError(validationError.message);
      } else {
        setError(err.response?.data?.message || 'Failed to change password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return validationErrors[field]?.[0];
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50/30">
        <AdminNavbar />
        <AdminMenuBar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        </main>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50/30">
        <AdminNavbar />
        <AdminMenuBar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">Failed to load profile data</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <AdminNavbar />
      <AdminMenuBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Profile Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and change your password
          </p>
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="mb-6 rounded-md bg-green-50 p-4">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6 max-w-2xl">
          {/* Profile Information */}
          <form onSubmit={handleProfileUpdate} className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-gray-400" />
              Profile Information
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className={`mt-1 block w-full rounded-md border ${
                    getFieldError('name') ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                />
                {getFieldError('name') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className={`mt-1 block w-full rounded-md border ${
                    getFieldError('email') ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                />
                {getFieldError('email') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className={`mt-1 block w-full rounded-md border ${
                    getFieldError('phoneNumber') ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                />
                {getFieldError('phoneNumber') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('phoneNumber')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <div className="mt-1">
                  <select
                    value={profileData.role}
                    onChange={(e) => setProfileData({ ...profileData, role: e.target.value as "Super Admin" | "Admin" })}
                    className={`mt-1 block w-full rounded-md border ${
                      getFieldError('role') ? 'border-red-300' : 'border-gray-300'
                    } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                  >
                    {VALID_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  {getFieldError('role') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('role')}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1 flex items-center">
                  <div className={`h-2.5 w-2.5 rounded-full mr-2 ${
                    profileData.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                  <span className="text-sm text-gray-900">{profileData.status}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>

          {/* Change Password */}
          <form onSubmit={handlePasswordChange} className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-gray-400" />
              Change Password
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className={`mt-1 block w-full rounded-md border ${
                    getFieldError('current_password') ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                />
                {getFieldError('current_password') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('current_password')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className={`mt-1 block w-full rounded-md border ${
                    getFieldError('password') ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                />
                {getFieldError('password') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('password')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className={`mt-1 block w-full rounded-md border ${
                    getFieldError('password_confirmation') ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                />
                {getFieldError('password_confirmation') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('password_confirmation')}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Changing Password...
                  </div>
                ) : (
                  'Change Password'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}