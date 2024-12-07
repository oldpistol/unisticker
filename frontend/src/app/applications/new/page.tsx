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

export default withAuth(NewApplication); // Apply withAuth HOC to NewApplication page

function NewApplication() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

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
      const applicationData = {
        vehicle_brand_model_id: parseInt(formData.vehicleBrand), // You'll need to update this to use actual brand model ID
        vehicle_plate_no: formData.vehiclePlateNo,
        vehicle_type: formData.vehicleType,
        vehicle_color: formData.vehicleColor,
        road_tax_expiry_date: formData.roadTaxExpiryDate,
        insurance_name: formData.insuranceName,
        insurance_number: formData.insuranceNumber,
        driving_license_no: formData.drivingLicenseNo,
        documents: [
          {
            file: formData.documents.roadTax!,
            type: 'road_tax'
          },
          {
            file: formData.documents.drivingLicenseFront!,
            type: 'driving_license_front'
          },
          {
            file: formData.documents.drivingLicenseBack!,
            type: 'driving_license_back'
          },
          {
            file: formData.documents.insuranceCoverNote!,
            type: 'insurance_cover_note'
          }
        ].filter(doc => doc.file !== null)
      };

      await createStickerApplication(applicationData);
      router.push('/applications');
    } catch (error) {
      console.error('Error submitting application:', error);
      // Handle error (show error message to user)
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
              <InputField
                label="Vehicle Brand"
                name="vehicleBrand"
                id="vehicleBrand"
                type="select"
                value={formData.vehicleBrand}
                onChange={(e) => handleInputChange('vehicleBrand', e.target.value)}
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
                onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                error={errors.vehicleModel}
                options={vehicleModels}
                required
              />
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
                onChange={(file) => handleFileChange('roadTax', file)}
              />

              <FileUploadField
                id="drivingLicenseFront"
                label="Driving License (Front)"
                accept=".pdf,.jpg,.jpeg,.png"
                value={formData.documents.drivingLicenseFront}
                onChange={(file) => handleFileChange('drivingLicenseFront', file)}
              />

              <FileUploadField
                id="drivingLicenseBack"
                label="Driving License (Back)"
                accept=".pdf,.jpg,.jpeg,.png"
                value={formData.documents.drivingLicenseBack}
                onChange={(file) => handleFileChange('drivingLicenseBack', file)}
              />

              <FileUploadField
                id="insuranceCoverNote"
                label="Insurance Cover Note"
                accept=".pdf,.jpg,.jpeg,.png"
                value={formData.documents.insuranceCoverNote}
                onChange={(file) => handleFileChange('insuranceCoverNote', file)}
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
