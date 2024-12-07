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

export const downloadDocument = async (documentId: number): Promise<void> => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${documentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to download document');
  }

  // Get filename from Content-Disposition header or use a default name
  const contentDisposition = response.headers.get('Content-Disposition');
  let filename = 'document';
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]+)"?/);
    if (match) {
      filename = match[1];
    }
  }

  // Create blob from response and trigger download
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
