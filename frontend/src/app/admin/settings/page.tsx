'use client';
import { withAdminAuth } from '@/middleware/withAdminAuth';
import { useState, useEffect } from 'react';
import AdminMenuBar from '@/components/admin/AdminMenuBar';
import { 
  Mail, 
  MessageSquare, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { getSettings, updateSettings, sendTestEmail, sendTestSms } from '@/services/settings';
import type { EmailGatewayConfig, SmsGatewayConfig } from '@/services/settings';

interface EmailConfig {
  host: string;
  port: string;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  encryption: 'TLS' | 'SSL' | 'NONE';
}

interface SMSConfig {
  apiKey: string;
  apiSecret: string;
  senderId: string;
  endpoint: string;
}

function AdminSettings() {
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    host: '',
    port: '',
    username: '',
    password: '',
    fromEmail: '',
    fromName: '',
    encryption: 'TLS'
  });

  const [smsConfig, setSMSConfig] = useState<SMSConfig>({
    apiKey: '',
    apiSecret: '',
    senderId: '',
    endpoint: ''
  });

  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [isTestingSMS, setIsTestingSMS] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getSettings();
        if (response.email_gateway) {
          setEmailConfig({
            host: response.email_gateway.smtp_host,
            port: response.email_gateway.smtp_port.toString(),
            username: response.email_gateway.username || '',
            password: response.email_gateway.password || '',
            fromEmail: response.email_gateway.from_email,
            fromName: response.email_gateway.from_name,
            encryption: response.email_gateway.encryption
          });
        }
        if (response.sms_gateway) {
          setSMSConfig({
            apiKey: response.sms_gateway.api_key,
            apiSecret: response.sms_gateway.api_secret,
            senderId: response.sms_gateway.sender_id,
            endpoint: response.sms_gateway.api_endpoint
          });
        }
      } catch (err) {
        setError('Failed to load settings');
        setTimeout(() => setError(''), 3000);
      }
    };
    fetchSettings();
  }, []);

  const handleEmailConfigSave = async () => {
    setIsSaving(true);
    try {
      const emailGatewayConfig: EmailGatewayConfig = {
        smtp_host: emailConfig.host,
        smtp_port: parseInt(emailConfig.port),
        username: emailConfig.username,
        password: emailConfig.password,
        from_email: emailConfig.fromEmail,
        from_name: emailConfig.fromName,
        encryption: emailConfig.encryption
      };

      await updateSettings({ email_gateway: emailGatewayConfig });
      setSuccessMessage('Email configuration saved successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to save email configuration');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSMSConfigSave = async () => {
    setIsSaving(true);
    try {
      const smsGatewayConfig: SmsGatewayConfig = {
        api_key: smsConfig.apiKey,
        api_secret: smsConfig.apiSecret,
        sender_id: smsConfig.senderId,
        api_endpoint: smsConfig.endpoint
      };

      await updateSettings({ sms_gateway: smsGatewayConfig });
      setSuccessMessage('SMS configuration saved successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to save SMS configuration');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmail = async () => {
    setIsTestingEmail(true);
    try {
      await sendTestEmail();
      setSuccessMessage('Test email sent successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to send test email');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsTestingEmail(false);
    }
  };

  const handleTestSMS = async () => {
    setIsTestingSMS(true);
    try {
      await sendTestSms();
      setSuccessMessage('Test SMS sent successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to send test SMS');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsTestingSMS(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <AdminMenuBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure system settings and integrations
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

        <div className="space-y-6">
          {/* Email Configuration */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-gray-400" />
              Email Gateway Configuration
            </h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SMTP Host
                </label>
                <input
                  type="text"
                  value={emailConfig.host}
                  onChange={(e) => setEmailConfig({ ...emailConfig, host: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  SMTP Port
                </label>
                <input
                  type="text"
                  value={emailConfig.port}
                  onChange={(e) => setEmailConfig({ ...emailConfig, port: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={emailConfig.username}
                  onChange={(e) => setEmailConfig({ ...emailConfig, username: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={emailConfig.password}
                  onChange={(e) => setEmailConfig({ ...emailConfig, password: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  From Email
                </label>
                <input
                  type="email"
                  value={emailConfig.fromEmail}
                  onChange={(e) => setEmailConfig({ ...emailConfig, fromEmail: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  From Name
                </label>
                <input
                  type="text"
                  value={emailConfig.fromName}
                  onChange={(e) => setEmailConfig({ ...emailConfig, fromName: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Encryption
                </label>
                <select
                  value={emailConfig.encryption}
                  onChange={(e) => setEmailConfig({ ...emailConfig, encryption: e.target.value as EmailConfig['encryption'] })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="TLS">TLS</option>
                  <option value="SSL">SSL</option>
                  <option value="NONE">None</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleTestEmail}
                disabled={isTestingEmail}
                className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-md hover:bg-indigo-100"
              >
                {isTestingEmail ? 'Sending...' : 'Send Test Email'}
              </button>
              <button
                onClick={handleEmailConfigSave}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                {isSaving ? 'Saving...' : 'Save Email Configuration'}
              </button>
            </div>
          </div>

          {/* SMS Configuration */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-gray-400" />
              SMS Gateway Configuration
            </h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  API Key
                </label>
                <input
                  type="text"
                  value={smsConfig.apiKey}
                  onChange={(e) => setSMSConfig({ ...smsConfig, apiKey: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  API Secret
                </label>
                <input
                  type="password"
                  value={smsConfig.apiSecret}
                  onChange={(e) => setSMSConfig({ ...smsConfig, apiSecret: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sender ID
                </label>
                <input
                  type="text"
                  value={smsConfig.senderId}
                  onChange={(e) => setSMSConfig({ ...smsConfig, senderId: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  API Endpoint
                </label>
                <input
                  type="text"
                  value={smsConfig.endpoint}
                  onChange={(e) => setSMSConfig({ ...smsConfig, endpoint: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleTestSMS}
                disabled={isTestingSMS}
                className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-md hover:bg-indigo-100"
              >
                {isTestingSMS ? 'Sending...' : 'Send Test SMS'}
              </button>
              <button
                onClick={handleSMSConfigSave}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                {isSaving ? 'Saving...' : 'Save SMS Configuration'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAdminAuth(AdminSettings);