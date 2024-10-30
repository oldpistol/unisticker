'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MenuBar from '@/components/MenuBar';
import { getActiveMenuItems } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BackButton } from '@/components/BackButton';
import InputField from '@/components/InputField';
import FormSection from '@/components/FormSection';
import SubmitButton from '@/components/SubmitButton';
import { FileUploadBox } from '@/components/FileUploadBox';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

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

const NewApplication = () => {
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
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a loading spinner
  }

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

  const validateStep = (currentStep: number) => {
    let stepErrors: Partial<FormData> = {};
    
    if (currentStep === 1) {
      if (!formData.fullName) stepErrors.fullName = 'Full name is required';
      if (!formData.matricNo) stepErrors.matricNo = 'Matric number is required';
      if (!formData.icNo) stepErrors.icNo = 'IC number is required';
    } else if (currentStep === 2) {
      if (!formData.licenseNo) stepErrors.licenseNo = 'License number is required';
      if (!formData.vehicleNo) stepErrors.vehicleNo = 'Vehicle number is required';
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <MenuBar items={getActiveMenuItems(pathname)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <BackButton href="/applications" label="Back to Applications" />
            <h1 className="text-3xl font-bold text-gray-900 mt-4">New Sticker Application</h1>
            <p className="text-gray-600 mt-2">Please fill in all required information</p>
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-10" />
            {['Personal Details', 'Vehicle Information', 'Documents'].map((label, idx) => (
              <div key={label} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                  ${step > idx + 1 ? 'bg-green-500 ring-2 ring-green-100' : 
                    step === idx + 1 ? 'bg-indigo-600 ring-2 ring-indigo-100' : 
                    'bg-gray-200'} 
                  text-white font-semibold transition-all duration-200`}>
                  {step > idx + 1 ? <Check className="w-6 h-6" /> : idx + 1}
                </div>
                <span className="mt-2 text-sm font-medium text-gray-600">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <FormSection
                title="Personal Information"
                description="Please enter your personal details as they appear on your official documents."
              >
                <div className="grid gap-6">
                  <InputField
                    id="fullName"
                    name="fullName"
                    label="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    error={errors.fullName}
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      id="matricNo"
                      name="matricNo"
                      label="Matric Number"
                      value={formData.matricNo}
                      onChange={handleInputChange}
                      error={errors.matricNo}
                      required
                    />
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
              </FormSection>
            )}

            {/* Step 2: Vehicle Information */}
            {step === 2 && (
              <FormSection
                title="Vehicle Information"
                description="Enter your vehicle and license details accurately."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    id="licenseNo"
                    name="licenseNo"
                    label="License Number"
                    value={formData.licenseNo}
                    onChange={handleInputChange}
                    error={errors.licenseNo}
                    required
                  />
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
              </FormSection>
            )}

            {/* Step 3: Documents */}
            {step === 3 && (
              <FormSection
                title="Required Documents"
                description="Upload clear, legible scans or photos of your documents."
              >
                <div className="grid gap-6">
                  <FileUploadBox
                    name="ic"
                    label="IC Card"
                    description="Upload a clear photo or scan of your IC"
                    onFileChange={handleFileChange}
                    currentFile={formData.documents.ic}
                  />
                  <FileUploadBox
                    name="matric"
                    label="Matric Card"
                    description="Upload a clear photo or scan of your matric card"
                    onFileChange={handleFileChange}
                    currentFile={formData.documents.matric}
                  />
                  <FileUploadBox
                    name="license"
                    label="Driving License"
                    description="Upload a clear photo or scan of your driving license"
                    onFileChange={handleFileChange}
                    currentFile={formData.documents.license}
                  />
                </div>
              </FormSection>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
              ) : <div />}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <SubmitButton label="Submit Application" />
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewApplication;
