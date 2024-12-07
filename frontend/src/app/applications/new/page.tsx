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
import FileUploadField from '@/components/FileUploadField';
import { createStickerApplication } from '@/services/stickerApplicationService';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/userService';
import { toast } from 'sonner';
import withAuth from '@/middleware/withAuth'; // Import withAuth HOC
import { getVehicleBrandModels, type VehicleBrandModels } from '@/services/vehicleService';

interface FormData {
  fullName: string
  matricNo: string
  email: string
  phoneNumber: string
  address: string
  drivingLicenseNo: string
  vehiclePlateNo: string
  vehicleType: string
  vehicleBrand: string
  vehicleModel: string
  vehicleColor: string
  isVehicleOwner: boolean
  ownerFullName: string
  roadTaxExpiryDate: string
  insuranceName: string
  insuranceNumber: string
  vehicle_brand_model_id: number
  documents: {
    roadTax: File | null;
    drivingLicenseFront: File | null;
    drivingLicenseBack: File | null;
    insuranceCoverNote: File | null;
  }
}

interface StickerApplicationRequest {
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

export default withAuth(NewApplication); // Apply withAuth HOC to NewApplication page

function NewApplication() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    matricNo: '',
    email: '',
    phoneNumber: '',
    address: '',
    drivingLicenseNo: '',
    vehiclePlateNo: '',
    vehicleType: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleColor: '',
    isVehicleOwner: true,
    ownerFullName: '',
    roadTaxExpiryDate: '',
    insuranceName: '',
    insuranceNumber: '',
    vehicle_brand_model_id: 0,
    documents: {
      roadTax: null,
      drivingLicenseFront: null,
      drivingLicenseBack: null,
      insuranceCoverNote: null,
    },
  });

  const vehicleTypes = ['Car', 'Motorcycle', 'Van', 'Others'];
  const insuranceCompanies = ['Etiqa', 'Allianz', 'AIG', 'Zurich', 'Others'];

  const [vehicleBrandModels, setVehicleBrandModels] = useState<VehicleBrandModels>({});
  const [selectedBrand, setSelectedBrand] = useState<string>('');

  const [errors, setErrors] = useState<{
    [key in keyof FormData]?: string;
  } & {
    documents?: {
      roadTax?: string;
      drivingLicenseFront?: string;
      drivingLicenseBack?: string;
      insuranceCoverNote?: string;
    }
  }>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userData = await getCurrentUser();
        console.log('Setting form data with:', userData); // Debug log
        setFormData(prevData => ({
          ...prevData,
          fullName: userData.name,
          matricNo: userData.matric_id,
          email: userData.email,
          phoneNumber: userData.phone_no
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchVehicleBrandModels = async () => {
      try {
        const data = await getVehicleBrandModels();
        setVehicleBrandModels(data);
      } catch (error) {
        console.error('Error fetching vehicle brands and models:', error);
        toast.error('Failed to load vehicle brands and models');
      }
    };

    fetchVehicleBrandModels();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
    </div>;
  }

  const isAutoPopulatedField = (fieldName: string) => {
    return ['fullName', 'matricNo', 'email', 'phoneNumber'].includes(fieldName);
  };

  const handleInputChange = (name: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (
    fieldName: keyof typeof formData.documents, 
    file: File | null
  ) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [fieldName]: file
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      // Validate required fields
      const requiredFields: (keyof FormData)[] = [
        'fullName',
        'matricNo',
        'email',
        'phoneNumber',
        'address',
        'drivingLicenseNo',
        'vehiclePlateNo',
        'vehicleType',
        'vehicleBrand',
        'vehicleModel',
        'vehicleColor',
        'roadTaxExpiryDate',
        'insuranceName',
        'insuranceNumber'
      ];

      const requiredDocuments = [
        'roadTax',
        'drivingLicenseFront',
        'drivingLicenseBack',
        'insuranceCoverNote'
      ] as const;

      const errors: { 
        [key: string]: string 
      } = {};
      
      const requiredDocumentsErrors: { [key: string]: string } = {};

      requiredFields.forEach(field => {
        if (!formData[field as keyof FormData]) {
          errors[field as keyof FormData] = 'This field is required';
        }
      });

      requiredDocuments.forEach(doc => {
        const docKey = doc as keyof typeof formData.documents;
        if (!formData.documents[docKey] || !(formData.documents[docKey] instanceof File)) {
          requiredDocumentsErrors[doc] = 'This document is required';
        }
      });

      if (Object.keys(errors).length > 0 || Object.keys(requiredDocumentsErrors).length > 0) {
        setErrors(prevErrors => {
          const newErrors = { ...prevErrors, ...errors };
          if (Object.keys(requiredDocumentsErrors).length > 0) {
            (newErrors as any).documents = requiredDocumentsErrors;
          }
          return newErrors;
        });
        toast.error('Please fill in all required fields');
        return;
      }

      // Prepare documents array
      const documents: { file: File; type: string }[] = [
        { file: formData.documents.roadTax!, type: 'Road Tax' },
        { file: formData.documents.drivingLicenseFront!, type: 'Driving License Front' },
        { file: formData.documents.drivingLicenseBack!, type: 'Driving License Back' },
        { file: formData.documents.insuranceCoverNote!, type: 'Insurance Cover Note' }
      ].filter((doc): doc is { file: File; type: string } => doc.file !== null);

      // Prepare request data
      const requestData: StickerApplicationRequest = {
        vehicle_brand_model_id: formData.vehicle_brand_model_id,
        vehicle_plate_no: formData.vehiclePlateNo,
        vehicle_type: formData.vehicleType,
        vehicle_color: formData.vehicleColor,
        road_tax_expiry_date: formData.roadTaxExpiryDate,
        insurance_name: formData.insuranceName,
        insurance_number: formData.insuranceNumber,
        driving_license_no: formData.drivingLicenseNo,
        documents: documents
      };

      console.log('Submitting application:', requestData);
      const response = await createStickerApplication(requestData);
      console.log('Application submitted:', response);

      toast.success('Application submitted successfully');
      router.push('/applications');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <MenuBar items={getActiveMenuItems(pathname)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/applications"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Applications
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Full Name"
                name="fullName"
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                error={errors.fullName}
                required
                disabled={isAutoPopulatedField('fullName')}
              />
              <InputField
                label="Matric Number"
                name="matricNo"
                id="matricNo"
                value={formData.matricNo}
                onChange={(e) => handleInputChange('matricNo', e.target.value)}
                error={errors.matricNo}
                required
                disabled={isAutoPopulatedField('matricNo')}
              />
              <InputField
                label="Email"
                name="email"
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                required
                disabled={isAutoPopulatedField('email')}
              />
              <InputField
                label="Phone Number"
                name="phoneNumber"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                error={errors.phoneNumber}
                required
                disabled={isAutoPopulatedField('phoneNumber')}
              />
              <div className="md:col-span-2">
                <InputField
                  label="Address"
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  error={errors.address}
                  required
                  multiline
                />
              </div>
              <InputField
                label="Driving License No"
                name="drivingLicenseNo"
                id="drivingLicenseNo"
                value={formData.drivingLicenseNo}
                onChange={(e) => handleInputChange('drivingLicenseNo', e.target.value)}
                error={errors.drivingLicenseNo}
                required
              />
            </div>
          </div>

          {/* Vehicle Information Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Car className="h-5 w-5 mr-2" />
              Vehicle Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Vehicle Plate No"
                name="vehiclePlateNo"
                id="vehiclePlateNo"
                value={formData.vehiclePlateNo}
                onChange={(e) => handleInputChange('vehiclePlateNo', e.target.value)}
                error={errors.vehiclePlateNo}
                required
              />
              <InputField
                label="Vehicle Type"
                name="vehicleType"
                id="vehicleType"
                type="select"
                value={formData.vehicleType}
                onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                error={errors.vehicleType}
                options={vehicleTypes}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Brand
                </label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    setFormData(prev => ({
                      ...prev,
                      vehicleBrand: e.target.value,
                      vehicleModel: '',
                      vehicle_brand_model_id: 0
                    }));
                  }}
                >
                  <option value="">Select Brand</option>
                  {Object.keys(vehicleBrandModels).map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Model
                </label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={formData.vehicle_brand_model_id || ''}
                  onChange={(e) => {
                    const modelId = parseInt(e.target.value);
                    const model = selectedBrand && vehicleBrandModels[selectedBrand]?.models.find(m => m.id === modelId);
                    setFormData(prev => ({
                      ...prev,
                      vehicleModel: model ? model.name : '',
                      vehicle_brand_model_id: modelId
                    }));
                  }}
                  disabled={!selectedBrand}
                >
                  <option value="">Select Model</option>
                  {selectedBrand &&
                    vehicleBrandModels[selectedBrand]?.models.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                </select>
              </div>
              <InputField
                label="Vehicle Color"
                name="vehicleColor"
                id="vehicleColor"
                value={formData.vehicleColor}
                onChange={(e) => handleInputChange('vehicleColor', e.target.value)}
                error={errors.vehicleColor}
                required
              />
              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isVehicleOwner"
                    id="isVehicleOwner"
                    checked={formData.isVehicleOwner}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      isVehicleOwner: e.target.checked
                    }))}
                    className="rounded border-gray-300"
                  />
                  <span>I am the vehicle owner</span>
                </label>
              </div>
              {!formData.isVehicleOwner && (
                <InputField
                  label="Owner Full Name"
                  name="ownerFullName"
                  id="ownerFullName"
                  value={formData.ownerFullName}
                  onChange={(e) => handleInputChange('ownerFullName', e.target.value)}
                  error={errors.ownerFullName}
                  required
                />
              )}
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Additional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Road Tax Expiry Date"
                name="roadTaxExpiryDate"
                id="roadTaxExpiryDate"
                type="date"
                value={formData.roadTaxExpiryDate}
                onChange={(e) => handleInputChange('roadTaxExpiryDate', e.target.value)}
                error={errors.roadTaxExpiryDate}
                required
              />
              <InputField
                label="Insurance Name"
                name="insuranceName"
                id="insuranceName"
                type="select"
                value={formData.insuranceName}
                onChange={(e) => handleInputChange('insuranceName', e.target.value)}
                error={errors.insuranceName}
                options={insuranceCompanies}
                required
              />
              <InputField
                label="Insurance Number"
                name="insuranceNumber"
                id="insuranceNumber"
                value={formData.insuranceNumber}
                onChange={(e) => handleInputChange('insuranceNumber', e.target.value)}
                error={errors.insuranceNumber}
                required
              />
            </div>
          </div>

          {/* Document Information Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Required Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploadField
                id="roadTax"
                label="Road Tax"
                accept=".pdf,.jpg,.jpeg,.png"
                value={formData.documents.roadTax}
                onChange={(file: File | null) => handleFileChange('roadTax', file)}
                error={errors.documents?.roadTax}
              />

              <FileUploadField
                id="drivingLicenseFront"
                label="Driving License (Front)"
                accept=".pdf,.jpg,.jpeg,.png"
                value={formData.documents.drivingLicenseFront}
                onChange={(file: File | null) => handleFileChange('drivingLicenseFront', file)}
                error={errors.documents?.drivingLicenseFront}
              />

              <FileUploadField
                id="drivingLicenseBack"
                label="Driving License (Back)"
                accept=".pdf,.jpg,.jpeg,.png"
                value={formData.documents.drivingLicenseBack}
                onChange={(file: File | null) => handleFileChange('drivingLicenseBack', file)}
                error={errors.documents?.drivingLicenseBack}
              />

              <FileUploadField
                id="insuranceCoverNote"
                label="Insurance Cover Note"
                accept=".pdf,.jpg,.jpeg,.png"
                value={formData.documents.insuranceCoverNote}
                onChange={(file: File | null) => handleFileChange('insuranceCoverNote', file)}
                error={errors.documents?.insuranceCoverNote}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/applications"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
