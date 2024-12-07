import axios from 'axios';

export interface ApplicationData {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    matric_id?: string;
    phone_no?: string;
  };
  vehicle: {
    id: number;
    plate_no: string;
    type: string;
    color: string;
    brand_model: string;
    driving_license_no?: string;
    road_tax_expiry_date?: string;
  };
  application_date: string;
  status: string;
  expiry_date: string | null;
  remarks: string | null;
  documents: Array<{
    id: number;
    name: string;
    type: string;
    file_path: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface ApplicationsResponse {
  data: ApplicationData[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ApplicationFilters {
  status?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export const getApplications = async (filters?: ApplicationFilters): Promise<ApplicationsResponse> => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sticker-applications`, {
    params: filters,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return {
    data: response.data.data || [],
    current_page: response.data.current_page || 1,
    last_page: response.data.last_page || 1,
    per_page: response.data.per_page || 10,
    total: response.data.total || 0
  };
};

export const getApplication = async (id: number): Promise<ApplicationData> => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sticker-applications/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.data.data;
};
