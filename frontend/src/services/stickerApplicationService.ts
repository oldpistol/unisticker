import api from './api';

export interface StickerApplicationRequest {
  vehicle_brand_model_id: number;
  vehicle_plate_no: string;
  vehicle_type: string;
  vehicle_color: string;
  road_tax_expiry_date: string;
  insurance_name: string;
  insurance_number: string;
  driving_license_no: string;
  documents: {
    file: File;
    type: string;
  }[];
}

export const createStickerApplication = async (data: StickerApplicationRequest) => {
  const formData = new FormData();

  // Append application data
  formData.append('vehicle_brand_model_id', data.vehicle_brand_model_id.toString());
  formData.append('vehicle_plate_no', data.vehicle_plate_no);
  formData.append('vehicle_type', data.vehicle_type);
  formData.append('vehicle_color', data.vehicle_color);
  formData.append('road_tax_expiry_date', data.road_tax_expiry_date);
  formData.append('insurance_name', data.insurance_name);
  formData.append('insurance_number', data.insurance_number);
  formData.append('driving_license_no', data.driving_license_no);

  // Append documents
  data.documents.forEach((doc, index) => {
    formData.append(`documents[${index}][file]`, doc.file);
    formData.append(`documents[${index}][type]`, doc.type);
  });

  const response = await api.post('/sticker-applications', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getStickerApplications = async (params?: {
  page?: number;
  search?: string;
  status?: string;
}) => {
  const response = await api.get('/sticker-applications', { params });
  return response.data;
};

export const getStickerApplication = async (id: number) => {
  const response = await api.get(`/sticker-applications/${id}`);
  return response.data;
};
