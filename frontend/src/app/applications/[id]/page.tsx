'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import withAuth from '@/middleware/withAuth';
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
  AlertCircle
} from 'lucide-react';
import MenuBar from '@/components/MenuBar';
import { getActiveMenuItems } from '@/utils/navigation';
import FileUploadField from '@/components/FileUploadField';

interface ApplicationDetail {
  studentName: string;
  studentId: string;
  email: string;
  phoneNumber: string;
  faculty: string;
  address: string;
  drivingLicenseNo: string;
  vehicleNo: string;
  vehicleType: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleColor: string;
  isVehicleOwner: boolean;
  ownerFullName: string;
  roadTaxExpiryDate: string;
  insuranceName: string;
  insuranceNumber: string;
  status: string;
  documents: Array<{ type: string; url: string }>;
  timeline: Array<{ status: string; date: string; comment?: string }>;
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

const ApplicationDetail = () => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        // Using dummy data for development
        const dummyData = {
          studentName: "John Doe",
          studentId: "A123456",
          email: "john.doe@example.com",
          phoneNumber: "+60123456789",
          faculty: "Faculty of Engineering",
          address: "123 Student Housing, University Road",
          drivingLicenseNo: "ABC123456",
          vehicleNo: "ABC 1234",
          vehicleType: "Car",
          vehicleBrand: "Toyota",
          vehicleModel: "Corolla",
          vehicleColor: "Silver",
          isVehicleOwner: true,
          ownerFullName: "John Doe",
          roadTaxExpiryDate: "2024-12-31",
          insuranceName: "AXA Insurance",
          insuranceNumber: "INS123456",
          status: "Pending",
          documents: [
            { type: "Road Tax", url: "/dummy/road-tax.pdf" },
            { type: "License Front", url: "/dummy/license-front.pdf" },
            { type: "License Back", url: "/dummy/license-back.pdf" },
            { type: "Insurance", url: "/dummy/insurance.pdf" }
          ],
          timeline: [
            { status: "Submitted", date: "2024-01-15", comment: "Application received" },
            { status: "Under Review", date: "2024-01-16", comment: "Application is being reviewed" }
          ]
        };
        setApplication(dummyData);
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
              <span className="text-sm font-medium">{application.status}</span>
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
                  <p className="text-sm text-gray-500">Matric Number</p>
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
                  <p className="text-sm text-gray-500">Faculty</p>
                  <p className="mt-1 font-medium text-gray-900">{application.faculty}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Driving License No.</p>
                  <p className="mt-1 font-medium text-gray-900">{application.drivingLicenseNo}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="mt-1 font-medium text-gray-900">{application.address}</p>
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
                <div>
                  <p className="text-sm text-gray-500">Vehicle Owner</p>
                  <p className="mt-1 font-medium text-gray-900">
                    {application.isVehicleOwner ? 'Self' : application.ownerFullName}
                  </p>
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
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center px-3 py-1.5 text-sm text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors"
                      >
                        View Document
                      </a>
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
                          {item.status}
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
    </div>
  );
};

export default withAuth(ApplicationDetail);
