import api from './api';

export interface VehicleBrandModel {
  id: number;
  name: string;
}

export interface VehicleBrandModels {
  [brand: string]: {
    models: VehicleBrandModel[];
  };
}

export const getVehicleBrandModels = async (): Promise<VehicleBrandModels> => {
  const response = await api.get('/vehicle-brand-models');
  return response.data;
};
