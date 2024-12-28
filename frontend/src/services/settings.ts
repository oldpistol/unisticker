import axios from '@/lib/adminAxios';

export interface EmailGatewayConfig {
  smtp_host: string;
  smtp_port: number;
  username: string;
  password: string;
  from_email: string;
  from_name: string;
  encryption: 'TLS' | 'SSL' | 'NONE';
}

export interface SmsGatewayConfig {
  api_key: string;
  api_secret: string;
  sender_id: string;
  api_endpoint: string;
}

export interface SettingsResponse {
  email_gateway: EmailGatewayConfig | null;
  sms_gateway: SmsGatewayConfig | null;
}

export const getSettings = async (): Promise<SettingsResponse> => {
  const response = await axios.get('/admin/settings');
  return response.data;
};

export const updateSettings = async (data: {
  email_gateway?: EmailGatewayConfig;
  sms_gateway?: SmsGatewayConfig;
}): Promise<SettingsResponse> => {
  const response = await axios.post('/admin/settings', data);
  return response.data;
};

export const sendTestEmail = async (): Promise<{ message: string }> => {
  const response = await axios.post('/admin/settings/test-email');
  return response.data;
};

export const sendTestSms = async (): Promise<{ message: string }> => {
  const response = await axios.post('/admin/settings/test-sms');
  return response.data;
};
