'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import withAuth from '@/middleware/withAuth';
import Image from 'next/image';
import { 
  ArrowLeft,
  User,
  Car,
  Calendar,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  X as XIcon,
  Download
} from 'lucide-react';
import MenuBar from '@/components/MenuBar';
import { getActiveMenuItems } from '@/utils/navigation';
import FileUploadField from '@/components/FileUploadField';
import { getApplication } from '@/services/applicationService';

interface ApplicationDetail {
  studentName: string;
  studentId: string;
  email: string;
  phoneNumber: string;
  vehicleNo: string;
  vehicleType: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleColor: string;
  drivingLicenseNo: string;
  roadTaxExpiryDate: string;
  insuranceName: string;
  insuranceNumber: string;
  status: string;
  documents: Array<{ type: string; name: string; url: string }>;
  timeline: Array<{ status: string; date: string; comment?: string }>;
}

interface VehicleResponse {
  plate_no: string;
  type: string;
  brand_model: string;
  color: string;
  driving_license_no?: string;
  road_tax_expiry_date?: string;
  insurance_name?: string;
  insurance_number?: string;
}

interface ApplicationResponse {
  user: {
    name: string;
    matric_id: string;  // This must be required
    email: string;
    phone_no?: string;
  };
  vehicle: VehicleResponse;
  status: string;
  documents?: Array<{
    type: string;
    name: string;
    url: string;
  }>;
  timeline?: Array<{
    status: string;
    date: string;
    comment?: string;
  }>;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'text-green-600 bg-green-50';
    case 'rejected':
      return 'text-red-600 bg-red-50';
    case 'pending':
      return 'text-yellow-600 bg-yellow-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return <CheckCircle className="w-5 h-5" />;
    case 'rejected':
      return <XCircle className="w-5 h-5" />;
    case 'pending':
      return <AlertCircle className="w-5 h-5" />;
    default:
      return <Clock className="w-5 h-5" />;
  }
};

const toTitleCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const ApplicationDetail = () => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response: ApplicationResponse = await getApplication(Number(params.id));
        setApplication({
          studentName: response.user.name,
          studentId: response.user.matric_id as string,
          email: response.user.email,
          phoneNumber: response.user.phone_no || '', 
          vehicleNo: response.vehicle.plate_no,
          vehicleType: response.vehicle.type,
          vehicleBrand: response.vehicle.brand_model.split(' ')[0],
          vehicleModel: response.vehicle.brand_model.split(' ').slice(1).join(' '),
          vehicleColor: response.vehicle.color,
          drivingLicenseNo: response.vehicle.driving_license_no || '',
          roadTaxExpiryDate: response.vehicle.road_tax_expiry_date || '',
          insuranceName: response.vehicle.insurance_name || '',
          insuranceNumber: response.vehicle.insurance_number || '',
          status: response.status,
          documents: response.documents || [],
          timeline: response.timeline || []
        });
      } catch (error) {
        console.error('Error fetching application:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/30">
        <Navbar />
        <MenuBar items={getActiveMenuItems(pathname)} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-sm text-gray-500">Loading application details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50/30">
        <Navbar />
        <MenuBar items={getActiveMenuItems(pathname)} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <p className="mt-4 text-sm text-gray-500">Application not found</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  Application Details
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  View your vehicle sticker application details
                </p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${getStatusColor(application.status)}`}>
              {getStatusIcon(application.status)}
              <span className="text-sm font-medium">{toTitleCase(application.status)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-400" />
                Personal Information
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="mt-1 font-medium text-gray-900">{application.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="mt-1 font-medium text-gray-900">{application.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="mt-1 font-medium text-gray-900">{application.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="mt-1 font-medium text-gray-900">{application.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Driving License No.</p>
                  <p className="mt-1 font-medium text-gray-900">{application.drivingLicenseNo}</p>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <Car className="w-5 h-5 mr-2 text-gray-400" />
                Vehicle Information
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Vehicle Plate No.</p>
                  <p className="mt-1 font-medium text-gray-900">{application.vehicleNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle Type</p>
                  <p className="mt-1 font-medium text-gray-900">{application.vehicleType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle Brand</p>
                  <p className="mt-1 font-medium text-gray-900">{application.vehicleBrand}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle Model</p>
                  <p className="mt-1 font-medium text-gray-900">{application.vehicleModel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle Color</p>
                  <p className="mt-1 font-medium text-gray-900">{application.vehicleColor}</p>
                </div>
              </div>
            </div>

            {/* Insurance Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-400" />
                Insurance Information
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Insurance Company</p>
                  <p className="mt-1 font-medium text-gray-900">{application.insuranceName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Policy Number</p>
                  <p className="mt-1 font-medium text-gray-900">{application.insuranceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Road Tax Expiry Date</p>
                  <p className="mt-1 font-medium text-gray-900">{application.roadTaxExpiryDate}</p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-400" />
                Documents
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {application.documents.map((doc, index) => (
                  <div key={index} className="relative h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-4 group">
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <FileText className="h-12 w-12 text-gray-400" />
                      <span className="mt-2 text-sm font-medium text-gray-900">{doc.type}</span>
                      <span className="text-xs text-gray-500">{doc.name}</span>
                      {doc.url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/) ? (
                        <button
                          onClick={() => setSelectedImage(doc.url)}
                          className="mt-2 inline-flex items-center px-3 py-1.5 text-sm text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors"
                        >
                          View Image
                        </button>
                      ) : doc.url.toLowerCase().endsWith('.pdf') ? (
                        <a
                          href={doc.url}
                          download={doc.name}
                          className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download PDF
                        </a>
                      ) : (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center px-3 py-1.5 text-sm text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors"
                        >
                          View Document
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-400" />
                Application Timeline
              </h2>
              <div className="relative">
                {application.timeline.map((item, index) => (
                  <div key={index} className="relative pb-8">
                    {index !== application.timeline.length - 1 && (
                      <div className="absolute left-3 top-5 h-full w-0.5 bg-indigo-100" aria-hidden="true" />
                    )}
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {toTitleCase(item.status)}
                        </div>
                        <div className="mt-0.5 text-sm text-gray-500">
                          {item.date}
                        </div>
                        {item.comment && (
                          <div className="mt-2 text-sm text-gray-600">
                            {item.comment}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative max-w-4xl max-h-[90vh] w-full mx-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <XIcon className="w-6 h-6" />
            </button>
            <div className="relative w-full h-full">
              {/* Using img tag instead of next/image for external URLs */}
              <img
                src={selectedImage}
                alt="Document Preview"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(ApplicationDetail);
