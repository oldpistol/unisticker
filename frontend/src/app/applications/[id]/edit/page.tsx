'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
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

const EditApplication = () => {
  const router = useRouter();
  const params = useParams();
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
  const vehicleModels = ['Vios', 'Civic', 'Saga', 'Myvi', 'Others'];
  const insuranceCompanies = ['Etiqa', 'Allianz', 'AIG', 'Zurich', 'Others'];

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch(`/api/applications/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch application');
        const data = await response.json();
        
        setFormData({
          ...formData,
          ...data,
          documents: {
            roadTax: null,
            drivingLicenseFront: null,
            drivingLicenseBack: null,
            insuranceCoverNote: null,
          }
        });
      } catch (error) {
        console.error('Error fetching application:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (name: string, file: File | null) => {
    if (file) {
      setFormData(prevData => ({
        ...prevData,
        documents: {
          ...prevData.documents,
          [name]: file
        }
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add validation logic here
    
    try {
      const formDataToSend = new FormData();
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'documents') {
          formDataToSend.append(key, value.toString());
        }
      });
      
      // Append documents
      Object.entries(formData.documents).forEach(([key, file]) => {
        if (file) {
          formDataToSend.append(key, file);
        }
      });

      const response = await fetch(`/api/applications/${params.id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Failed to update application');

      router.push('/applications');
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <MenuBar items={getActiveMenuItems(pathname)} />
      
      <main className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link href="/applications" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Applications
            </Link>
          </div>

          <h1 className="text-2xl font-bold mb-6">Edit Vehicle Sticker Application</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <section>
                <div className="flex items-center mb-4">
                  <User className="w-5 h-5 mr-2" />
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    id="fullName"
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                  <InputField
                    id="matricNo"
                    label="Matric Number"
                    name="matricNo"
                    value={formData.matricNo}
                    onChange={handleInputChange}
                    required
                  />
                  <InputField
                    id="email"
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <InputField
                    id="phoneNumber"
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                  <InputField
                    id="address"
                    label="Address"
                    name="address"
                    multiline
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="md:col-span-2"
                  />
                  <InputField
                    id="drivingLicenseNo"
                    label="Driving License No"
                    name="drivingLicenseNo"
                    value={formData.drivingLicenseNo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </section>
            </div>

            {/* Vehicle Information Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <section>
                <div className="flex items-center mb-4">
                  <Car className="w-5 h-5 mr-2" />
                  <h2 className="text-xl font-semibold">Vehicle Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    id="vehiclePlateNo"
                    label="Vehicle Plate No"
                    name="vehiclePlateNo"
                    value={formData.vehiclePlateNo}
                    onChange={handleInputChange}
                    required
                  />
                  <InputField
                    id="vehicleType"
                    label="Vehicle Type"
                    name="vehicleType"
                    type="select"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    options={vehicleTypes}
                    required
                  />
                  <InputField
                    id="vehicleBrand"
                    label="Vehicle Brand"
                    name="vehicleBrand"
                    type="select"
                    value={formData.vehicleBrand}
                    onChange={handleInputChange}
                    options={vehicleBrands}
                    required
                  />
                  <InputField
                    id="vehicleModel"
                    label="Vehicle Model"
                    name="vehicleModel"
                    type="select"
                    value={formData.vehicleModel}
                    onChange={handleInputChange}
                    options={vehicleModels}
                    required
                  />
                  <InputField
                    id="vehicleColor"
                    label="Vehicle Color"
                    name="vehicleColor"
                    value={formData.vehicleColor}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="md:col-span-2 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isVehicleOwner"
                      name="isVehicleOwner"
                      checked={formData.isVehicleOwner}
                      onChange={(e) => setFormData(prev => ({ ...prev, isVehicleOwner: e.target.checked }))}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isVehicleOwner" className="text-sm font-medium text-gray-700">
                      Are you the vehicle owner?
                    </label>
                  </div>
                  {!formData.isVehicleOwner && (
                    <InputField
                      id="ownerFullName"
                      label="Owner's Full Name"
                      name="ownerFullName"
                      value={formData.ownerFullName}
                      onChange={handleInputChange}
                      required
                    />
                  )}
                </div>
              </section>
            </div>

            {/* Additional Information Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <section>
                <div className="flex items-center mb-4">
                  <FileText className="w-5 h-5 mr-2" />
                  <h2 className="text-xl font-semibold">Additional Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    id="roadTaxExpiryDate"
                    label="Road Tax Expiry Date"
                    name="roadTaxExpiryDate"
                    type="date"
                    value={formData.roadTaxExpiryDate}
                    onChange={handleInputChange}
                    required
                  />
                  <InputField
                    id="insuranceName"
                    label="Insurance Company"
                    name="insuranceName"
                    type="select"
                    value={formData.insuranceName}
                    onChange={handleInputChange}
                    options={insuranceCompanies}
                    required
                  />
                  <InputField
                    id="insuranceNumber"
                    label="Insurance Number"
                    name="insuranceNumber"
                    value={formData.insuranceNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </section>
            </div>

            {/* Required Documents Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <section>
                <div className="flex items-center mb-4">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <h2 className="text-xl font-semibold">Required Documents</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FileUploadField
                    label="Road Tax"
                    name="roadTax"
                    onChange={(file) => handleFileChange('roadTax', file)}
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                  <FileUploadField
                    label="Driving License (Front)"
                    name="drivingLicenseFront"
                    onChange={(file) => handleFileChange('drivingLicenseFront', file)}
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                  <FileUploadField
                    label="Driving License (Back)"
                    name="drivingLicenseBack"
                    onChange={(file) => handleFileChange('drivingLicenseBack', file)}
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                  <FileUploadField
                    label="Insurance Cover Note"
                    name="insuranceCoverNote"
                    onChange={(file) => handleFileChange('insuranceCoverNote', file)}
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                </div>
              </section>
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                href="/applications"
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Update Application
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default withAuth(EditApplication);
