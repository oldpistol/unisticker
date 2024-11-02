'use client';
import { useState } from 'react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminMenuBar from '@/components/admin/AdminMenuBar';
import { 
  Mail, 
  MessageSquare, 
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface EmailConfig {
  host: string;
  port: string;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  encryption: 'TLS' | 'SSL' | 'None';
}

interface SMSConfig {
  apiKey: string;
  apiSecret: string;
  senderId: string;
  endpoint: string;
}

export default function Settings() {
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    host: 'smtp.gmail.com',
    port: '587',
    username: '',
    password: '',
    fromEmail: 'noreply@unisticker.com',
    fromName: 'UniSticker System',
    encryption: 'TLS'
  });

  const [smsConfig, setSMSConfig] = useState<SMSConfig>({
    apiKey: '',
    apiSecret: '',
    senderId: 'UniSticker',
    endpoint: 'https://api.sms-gateway.com/v1/messages'
  });

  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [isTestingSMS, setIsTestingSMS] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const handleEmailConfigSave = async () => {
    try {
      // Add your save logic here
      console.log('Saving email config:', emailConfig);
      setSuccessMessage('Email configuration saved successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to save email configuration');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSMSConfigSave = async () => {
    try {
      // Add your save logic here
      console.log('Saving SMS config:', smsConfig);
      setSuccessMessage('SMS configuration saved successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to save SMS configuration');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleTestEmail = async () => {
    setIsTestingEmail(true);
    try {
      // Add your email test logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
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
      // Add your SMS test logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
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
      <AdminNavbar />
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
                  <option value="None">None</option>
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
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Save Email Configuration
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
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Save SMS Configuration
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 