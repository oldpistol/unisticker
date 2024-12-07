import api from './api';

export interface User {
  id: number;
  name: string;
  matric_id: string;
  email: string;
  phone_no: string;
}

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get('/auth/user');
    if (!response.data || !response.data.data) {
      throw new Error('No user data received');
    }
    // Extract the nested data
    const userData = response.data.data;
    console.log('Extracted user data:', userData); // Debug log
    return {
      id: userData.id,
      name: userData.name,
      matric_id: userData.matric_id,
      email: userData.email,
      phone_no: userData.phone_no
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};
