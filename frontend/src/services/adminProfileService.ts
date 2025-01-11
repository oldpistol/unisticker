import axios from '@/lib/adminAxios';

export const VALID_ROLES = ['Super Admin', 'Admin'] as const;
export type Role = typeof VALID_ROLES[number];

export interface AdminProfile {
  name: string;
  email: string;
  phoneNumber: string;
  role: Role;
  status: string;
}

export interface UpdateProfileData {
  name: string;
  email: string;
  phoneNumber: string;
  role: Role;
}

export interface UpdatePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ValidationError {
  message: string;
  errors: {
    [key: string]: string[];
  };
}

export const getProfile = async (): Promise<AdminProfile> => {
  const response = await axios.get('/admin/profile');
  return response.data;
};

export const updateProfile = async (data: UpdateProfileData): Promise<{ message: string; admin: AdminProfile }> => {
  const response = await axios.patch('/admin/profile', data);
  return response.data;
};

export const updatePassword = async (data: UpdatePasswordData): Promise<{ message: string }> => {
  const response = await axios.patch('/admin/profile/password', data);
  return response.data;
};
