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

interface FormData {
  // Personal Information
  fullName: string;
  matricNo: string;
  email: string;
  phoneNumber: string;
  address: string;
  drivingLicenseNo: string;

  // Vehicle Information
  vehiclePlateNo: string;
  vehicleType: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleColor: string;
  isVehicleOwner: boolean;
  ownerFullName: string;

  // Additional Information
  roadTaxExpiryDate: string;
  insuranceName: string;
  insuranceNumber: string;

  // Documents
  documents: {
    roadTax: File | null;
    drivingLicenseFront: File | null;
    drivingLicenseBack: File | null;
    insuranceCoverNote: File | null;
  };
}

export default function NewApplication() {
  const pathname = usePathname();
  const [formData, setFormData] = useState<FormData>({
    // Personal Information
    fullName: '',
    matricNo: '',
    email: '',
    phoneNumber: '',
    address: '',
    drivingLicenseNo: '',

    // Vehicle Information
    vehiclePlateNo: '',
    vehicleType: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleColor: '',
    isVehicleOwner: true,
    ownerFullName: '',

    // Additional Information
    roadTaxExpiryDate: '',
    insuranceName: '',
    insuranceNumber: '',

    // Documents
    documents: {
      roadTax: null,
      drivingLicenseFront: null,
      drivingLicenseBack: null,
      insuranceCoverNote: null,
    },
  });

  const vehicleTypes = ['Car', 'Motorcycle', 'Van', 'Others'];
  const vehicleBrands = ['Toyota', 'Honda', 'Proton', 'Perodua', 'Others'];
  const vehicleModels = ['Vios', 'Civic', 'Saga', 'Myvi', 'Others']; // This should be dynamic based on brand
  const insuranceCompanies = ['Etiqa', 'Allianz', 'AIG', 'Zurich', 'Others'];

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
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
    if (!formData.email) formErrors.email = 'Email is required';
    if (!formData.phoneNumber) formErrors.phoneNumber = 'Phone number is required';
    if (!formData.address) formErrors.address = 'Address is required';
    if (!formData.drivingLicenseNo) formErrors.drivingLicenseNo = 'Driving license number is required';

    if (!formData.vehiclePlateNo) formErrors.vehiclePlateNo = 'Vehicle plate number is required';
    if (!formData.vehicleType) formErrors.vehicleType = 'Vehicle type is required';
    if (!formData.vehicleBrand) formErrors.vehicleBrand = 'Vehicle brand is required';
    if (!formData.vehicleModel) formErrors.vehicleModel = 'Vehicle model is required';
    if (!formData.vehicleColor) formErrors.vehicleColor = 'Vehicle color is required';

    if (!formData.roadTaxExpiryDate) formErrors.roadTaxExpiryDate = 'Road tax expiry date is required';
    if (!formData.insuranceName) formErrors.insuranceName = 'Insurance name is required';
    if (!formData.insuranceNumber) formErrors.insuranceNumber = 'Insurance number is required';

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
                onChange={handleInputChange}
                error={errors.fullName}
                required
              />
              <InputField
                label="Matric Number"
                name="matricNo"
                id="matricNo"
                value={formData.matricNo}
                onChange={handleInputChange}
                error={errors.matricNo}
                required
              />
              <InputField
                label="Email"
                name="email"
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
              />
              <InputField
                label="Phone Number"
                name="phoneNumber"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                error={errors.phoneNumber}
                required
              />
              <div className="md:col-span-2">
                <InputField
                  label="Address"
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                error={errors.vehiclePlateNo}
                required
              />
              <InputField
                label="Vehicle Type"
                name="vehicleType"
                id="vehicleType"
                type="select"
                value={formData.vehicleType}
                onChange={handleInputChange}
                error={errors.vehicleType}
                options={vehicleTypes}
                required
              />
              <InputField
                label="Vehicle Brand"
                name="vehicleBrand"
                id="vehicleBrand"
                type="select"
                value={formData.vehicleBrand}
                onChange={handleInputChange}
                error={errors.vehicleBrand}
                options={vehicleBrands}
                required
              />
              <InputField
                label="Vehicle Model"
                name="vehicleModel"
                id="vehicleModel"
                type="select"
                value={formData.vehicleModel}
                onChange={handleInputChange}
                error={errors.vehicleModel}
                options={vehicleModels}
                required
              />
              <InputField
                label="Vehicle Color"
                name="vehicleColor"
                id="vehicleColor"
                value={formData.vehicleColor}
                onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                onChange={handleInputChange}
                error={errors.roadTaxExpiryDate}
                required
              />
              <InputField
                label="Insurance Name"
                name="insuranceName"
                id="insuranceName"
                type="select"
                value={formData.insuranceName}
                onChange={handleInputChange}
                error={errors.insuranceName}
                options={insuranceCompanies}
                required
              />
              <InputField
                label="Insurance Number"
                name="insuranceNumber"
                id="insuranceNumber"
                value={formData.insuranceNumber}
                onChange={handleInputChange}
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
                onChange={(file) => {
                  setFormData(prev => ({
                    ...prev,
                    documents: {
                      ...prev.documents,
                      roadTax: file
                    }
                  }));
                }}
              />

              <FileUploadField
                id="drivingLicenseFront"
                label="Driving License (Front)"
                accept=".pdf,.jpg,.jpeg,.png"
                value={formData.documents.drivingLicenseFront}
                onChange={(file) => {
                  setFormData(prev => ({
                    ...prev,
                    documents: {
                      ...prev.documents,
                      drivingLicenseFront: file
                    }
                  }));
                }}
              />

              <FileUploadField
                id="drivingLicenseBack"
                label="Driving License (Back)"
                accept=".pdf,.jpg,.jpeg,.png"
                value={formData.documents.drivingLicenseBack}
                onChange={(file) => {
                  setFormData(prev => ({
                    ...prev,
                    documents: {
                      ...prev.documents,
                      drivingLicenseBack: file
                    }
                  }));
                }}
              />

              <FileUploadField
                id="insuranceCoverNote"
                label="Insurance Cover Note"
                accept=".pdf,.jpg,.jpeg,.png"
                value={formData.documents.insuranceCoverNote}
                onChange={(file) => {
                  setFormData(prev => ({
                    ...prev,
                    documents: {
                      ...prev.documents,
                      insuranceCoverNote: file
                    }
                  }));
                }}
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
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
