'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { InputField, FormSection, SubmitButton } from '@/components';
import MenuBar from '@/components/MenuBar';
import Navbar from '@/components/Navbar';

interface ProfileData {
  fullName: string;
  email: string;
  matricNo: string;
  icNo: string;
  phoneNo: string;
  faculty: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function Profile() {
  const pathname = usePathname();
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    email: '',
    matricNo: '',
    icNo: '',
    phoneNo: '',
    faculty: '',
  });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Navbar />
      <MenuBar />
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-2 text-sm text-gray-600">Manage your account settings and preferences.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
                {/* Basic Information Section */}
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      id="fullName"
                      name="fullName"
                      label="Full Name"
                      value={profileData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                    <InputField
                      id="email"
                      name="email"
                      label="Email Address"
                      type="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      required
                    />
                    <InputField
                      id="phoneNo"
                      name="phoneNo"
                      label="Phone Number"
                      value={profileData.phoneNo}
                      onChange={handleInputChange}
                      required
                    />
                    <InputField
                      id="icNo"
                      name="icNo"
                      label="IC Number"
                      value={profileData.icNo}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Academic Information Section */}
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      id="matricNo"
                      name="matricNo"
                      label="Matric Number"
                      value={profileData.matricNo}
                      onChange={handleInputChange}
                      required
                    />
                    <InputField
                      id="faculty"
                      name="faculty"
                      label="Faculty"
                      value={profileData.faculty}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Save Changes Button */}
                <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
                  <div className="flex justify-end">
                    <SubmitButton label="Save Changes" />
                  </div>
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow-sm rounded-lg">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Change Password</h2>
                  <div className="space-y-4">
                    <InputField
                      id="currentPassword"
                      name="currentPassword"
                      label="Current Password"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    <InputField
                      id="newPassword"
                      name="newPassword"
                      label="New Password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    <InputField
                      id="confirmPassword"
                      name="confirmPassword"
                      label="Confirm New Password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                </div>
                
                {/* Change Password Button */}
                <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
                  <div className="flex justify-end">
                    <SubmitButton label="Update Password" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
