'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MenuBar from '@/components/MenuBar';
import { getActiveMenuItems } from '@/utils/navigation';
import Link from 'next/link';
import withAuth from '@/middleware/withAuth';
import { 
  ArrowLeft,
  User,
  Car,
  FileText,
  AlertCircle
} from 'lucide-react';
import FileUploadBox from '@/components/FileUploadBox';

interface FormData {
  // Personal Information
  fullName: string;
  matricNo: string;
  email: string;
  phoneNumber: string;
  faculty: string;
  address: string;

  // Vehicle Information
  vehicleNo: string;
  vehicleType: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleColor: string;

  // Documents
  documents: {
    ic: File | null;
    matric: File | null;
    license: File | null;
  };
}

interface DocumentUrls {
  ic: string | null;
  matric: string | null;
  license: string | null;
}

const EditApplication = () => {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    matricNo: '',
    email: '',
    phoneNumber: '',
    faculty: '',
    address: '',
    vehicleNo: '',
    vehicleType: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleColor: '',
    documents: {
      ic: null,
      matric: null,
      license: null,
    },
  });
  const [documentUrls, setDocumentUrls] = useState<DocumentUrls>({
    ic: null,
    matric: null,
    license: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        // TODO: Replace with actual API call
        // Mock data for now
        const mockData = {
          fullName: 'John Doe',
          matricNo: 'A123456',
          icNo: '990101-01-1234',
          licenseNo: 'D123456',
          vehicleNo: 'ABC 1234',
          documentUrls: {
            ic: '/mock/ic.pdf',
            matric: '/mock/matric.pdf',
            license: '/mock/license.pdf',
          },
        };

        setFormData({
          fullName: mockData.fullName,
          matricNo: mockData.matricNo,
          email: '',
          phoneNumber: '',
          faculty: '',
          address: '',
          vehicleNo: mockData.vehicleNo,
          vehicleType: '',
          vehicleBrand: '',
          vehicleModel: '',
          vehicleColor: '',
          documents: {
            ic: null,
            matric: null,
            license: null,
          },
        });
        setDocumentUrls(mockData.documentUrls);
      } catch (error) {
        console.error('Error fetching application:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (name: string, file: File) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [name]: file,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/30">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Navbar />
      <MenuBar items={getActiveMenuItems('/applications')} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href={`/applications/${params.id}`}
                className="mr-4 p-2 text-gray-400 hover:text-gray-500"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Edit Application
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Update your vehicle sticker application details
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-gray-400" />
              Personal Information
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  spellCheck="false"
                  data-ms-editor="false"
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Matric Number</label>
                <input
                  type="text"
                  name="matricNo"
                  value={formData.matricNo}
                  onChange={handleInputChange}
                  spellCheck="false"
                  data-ms-editor="false"
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  spellCheck="false"
                  data-ms-editor="false"
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  spellCheck="false"
                  data-ms-editor="false"
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Faculty</label>
                <input
                  type="text"
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleInputChange}
                  spellCheck="false"
                  data-ms-editor="false"
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  spellCheck="false"
                  data-ms-editor="false"
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Car className="w-5 h-5 mr-2 text-gray-400" />
              Vehicle Information
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
                <input
                  type="text"
                  name="vehicleNo"
                  value={formData.vehicleNo}
                  onChange={handleInputChange}
                  spellCheck="false"
                  data-ms-editor="false"
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                <input
                  type="text"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  spellCheck="false"
                  data-ms-editor="false"
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle Brand</label>
                <input
                  type="text"
                  name="vehicleBrand"
                  value={formData.vehicleBrand}
                  onChange={handleInputChange}
                  spellCheck="false"
                  data-ms-editor="false"
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle Model</label>
                <input
                  type="text"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleInputChange}
                  spellCheck="false"
                  data-ms-editor="false"
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vehicle Color</label>
                <input
                  type="text"
                  name="vehicleColor"
                  value={formData.vehicleColor}
                  onChange={handleInputChange}
                  spellCheck="false"
                  data-ms-editor="false"
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-gray-400" />
              Required Documents
            </h2>
            <div className="grid grid-cols-3 gap-6">
              <FileUploadBox
                name="ic"
                label="IC Card"
                description="Upload a clear copy of your IC"
                onFileChange={handleFileChange}
                currentFile={formData.documents.ic}
                existingUrl={documentUrls.ic ?? undefined}
              />
              <FileUploadBox
                name="matric"
                label="Matric Card"
                description="Upload a clear copy of your matric card"
                onFileChange={handleFileChange}
                currentFile={formData.documents.matric}
                existingUrl={documentUrls.matric ?? undefined}
              />
              <FileUploadBox
                name="license"
                label="Driving License"
                description="Upload a clear copy of your driving license"
                onFileChange={handleFileChange}
                currentFile={formData.documents.license}
                existingUrl={documentUrls.license ?? undefined}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Application
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default withAuth(EditApplication);
