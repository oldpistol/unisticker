'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MenuBar from '@/components/MenuBar';
import { getActiveMenuItems } from '@/utils/navigation';
import { BackButton, InputField, FormSection, SubmitButton } from '@/components';
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

interface DocumentUrls {
  ic: string | null;
  matric: string | null;
  license: string | null;
}

export default function EditApplication() {
  const { id } = useParams();
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
          ...mockData,
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
  }, [id]);

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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <MenuBar items={getActiveMenuItems('/applications')} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <BackButton href="/applications" label="Back to Applications" />
            <h1 className="text-3xl font-bold text-gray-900 mt-2">Edit Vehicle Sticker Application</h1>
            <p className="text-gray-600 mt-1">Update your application details and documents</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <FormSection 
              title="Personal Information" 
              description="Your identification details"
            >
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <InputField
                  id="fullName"
                  name="fullName"
                  label="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  id="matricNo"
                  name="matricNo"
                  label="Matric Number"
                  value={formData.matricNo}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  id="icNo"
                  name="icNo"
                  label="IC Number"
                  value={formData.icNo}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </FormSection>
          </div>

          {/* Vehicle Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <FormSection 
              title="Vehicle Information" 
              description="Your vehicle and license details"
            >
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <InputField
                  id="licenseNo"
                  name="licenseNo"
                  label="License Number"
                  value={formData.licenseNo}
                  onChange={handleInputChange}
                  required
                />
                <InputField
                  id="vehicleNo"
                  name="vehicleNo"
                  label="Vehicle Number"
                  value={formData.vehicleNo}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </FormSection>
          </div>

          {/* Documents Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <FormSection 
              title="Required Documents" 
              description="Upload clear, readable copies of your documents"
            >
              <div className="grid md:grid-cols-3 gap-6 mt-4">
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
            </FormSection>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <SubmitButton label="Update Application" />
          </div>
        </form>
      </main>
    </div>
  );
}
