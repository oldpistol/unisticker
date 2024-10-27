'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MenuBar from '@/components/MenuBar';
import { getActiveMenuItems } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import { InputField, FormSection, SubmitButton } from '@/components';

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

  if (!mounted) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(profileData);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(passwordData);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <MenuBar items={getActiveMenuItems(pathname)} />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
        
        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Basic Information */}
            <FormSection title="Basic Information">
              <div className="space-y-4">
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
              </div>
            </FormSection>

            {/* Academic Information */}
            <FormSection title="Academic Information">
              <div className="space-y-4">
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
                <InputField
                  id="icNo"
                  name="icNo"
                  label="IC Number"
                  value={profileData.icNo}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </FormSection>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <SubmitButton label="Update Profile" />
          </div>
        </form>

        {/* Change Password Form */}
        <form onSubmit={handlePasswordSubmit} className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h2>
          <div className="max-w-md space-y-4">
            <FormSection title="Password Details">
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
            </FormSection>
          </div>

          <div className="mt-8 flex justify-end">
            <SubmitButton label="Change Password" />
          </div>
        </form>
      </main>
    </div>
  );
}
