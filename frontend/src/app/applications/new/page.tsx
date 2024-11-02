'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MenuBar from '@/components/MenuBar';
import { getActiveMenuItems } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  User,
  Car,
  FileText,
  AlertCircle
} from 'lucide-react';
import InputField from '@/components/InputField';
import { FileUploadBox } from '@/components/FileUploadBox';

interface FormData {
  fullName: string;
  matricNo: string;
  icNo: string;
  licenseNo: string;
  vehicleNo: string;
  documents: {
    ic: File | null;
    matric: File | null;
    license: File | null;
  };
}

export default function NewApplication() {
  const pathname = usePathname();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    matricNo: '',
    icNo: '',
    licenseNo: '',
    vehicleNo: '',
    documents: {
      ic: null,
      matric: null,
      license: null,
    },
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  const validateForm = () => {
    let formErrors: Partial<FormData> = {};
    
    if (!formData.fullName) formErrors.fullName = 'Full name is required';
    if (!formData.matricNo) formErrors.matricNo = 'Matric number is required';
    if (!formData.icNo) formErrors.icNo = 'IC number is required';
    if (!formData.licenseNo) formErrors.licenseNo = 'License number is required';
    if (!formData.vehicleNo) formErrors.vehicleNo = 'Vehicle number is required';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      // Add your submission logic here
      console.log('Submitting application:', formData);
      // Redirect to applications list after successful submission
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Navbar />
      <MenuBar items={getActiveMenuItems(pathname)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/applications"
                className="mr-4 p-2 text-gray-400 hover:text-gray-500"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  New Vehicle Sticker Application
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Fill in the required information to apply for a vehicle sticker
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-400" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <InputField
                    id="fullName"
                    name="fullName"
                    label="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    error={errors.fullName}
                    required
                  />
                </div>
                <div>
                  <InputField
                    id="matricNo"
                    name="matricNo"
                    label="Matric Number"
                    value={formData.matricNo}
                    onChange={handleInputChange}
                    error={errors.matricNo}
                    required
                  />
                </div>
                <div>
                  <InputField
                    id="icNo"
                    name="icNo"
                    label="IC Number"
                    value={formData.icNo}
                    onChange={handleInputChange}
                    error={errors.icNo}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <Car className="w-5 h-5 mr-2 text-gray-400" />
                Vehicle Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <InputField
                    id="licenseNo"
                    name="licenseNo"
                    label="License Number"
                    value={formData.licenseNo}
                    onChange={handleInputChange}
                    error={errors.licenseNo}
                    required
                  />
                </div>
                <div>
                  <InputField
                    id="vehicleNo"
                    name="vehicleNo"
                    label="Vehicle Number"
                    value={formData.vehicleNo}
                    onChange={handleInputChange}
                    error={errors.vehicleNo}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-400" />
                Required Documents
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <FileUploadBox
                    name="ic"
                    label="IC Card"
                    description="Upload a clear photo or scan of your IC"
                    onFileChange={handleFileChange}
                    currentFile={formData.documents.ic}
                  />
                </div>
                <div>
                  <FileUploadBox
                    name="matric"
                    label="Matric Card"
                    description="Upload a clear photo or scan of your matric card"
                    onFileChange={handleFileChange}
                    currentFile={formData.documents.matric}
                  />
                </div>
                <div>
                  <FileUploadBox
                    name="license"
                    label="Driving License"
                    description="Upload a clear photo or scan of your driving license"
                    onFileChange={handleFileChange}
                    currentFile={formData.documents.license}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Link
                href="/applications"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirm Submission
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to submit this application? Please ensure all information is correct.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Confirm Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
