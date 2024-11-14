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
  Clock
} from 'lucide-react';
import MenuBar from '@/components/MenuBar';
import { getActiveMenuItems } from '@/utils/navigation';

// Use the same ApplicationDetail interface from admin module
interface ApplicationDetail {
  studentName: string;
  studentId: string;
  email: string;
  phoneNumber: string;
  faculty: string;
  address: string;
  vehicleNo: string;
  vehicleType: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleColor: string;
  status: string;
  documents: Array<{ type: string; url: string }>;
  timeline: Array<{ status: string; date: string; comment?: string }>;
}

const ApplicationDetail = () => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch application details
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
          vehicleNo: "ABC 1234",
          vehicleType: "Car",
          vehicleBrand: "Toyota",
          vehicleModel: "Corolla",
          vehicleColor: "Silver",
          status: "Pending",
          documents: [
            { type: "Student ID", url: "/dummy/student-id.pdf" },
            { type: "License", url: "/dummy/license.pdf" }
          ],
          timeline: [
            { status: "Submitted", date: "2024-01-15", comment: "Application received" }
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
    return <div>Loading...</div>;
  }

  if (!application) {
    return <div>Application not found</div>;
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
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-400" />
                Personal Information
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{application.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Matric Number</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{application.studentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{application.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{application.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Faculty</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{application.faculty}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{application.address}</p>
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
                  <p className="text-sm text-gray-500">Vehicle Number</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{application.vehicleNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle Type</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{application.vehicleType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Brand</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{application.vehicleBrand}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Model</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{application.vehicleModel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Color</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{application.vehicleColor}</p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-400" />
                Documents
              </h2>
              <div className="space-y-4">
                {application.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">{doc.type}</span>
                    <a
                      href={doc.url}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Document
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Application Status</h2>
              <span className={`px-3 py-1 inline-flex text-sm font-medium rounded-full ${
                application.status === "Approved" 
                  ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                  : application.status === "Pending"
                  ? "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20"
                  : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
              }`}>
                {application.status}
              </span>
            </div>

            {/* Timeline */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Timeline</h2>
              <div className="flow-root">
                <ul role="list" className="-mb-8">
                  {application.timeline.map((event, eventIdx) => (
                    <li key={eventIdx}>
                      <div className="relative pb-8">
                        {eventIdx !== application.timeline.length - 1 ? (
                          <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                              <Clock className="h-5 w-5 text-gray-500" />
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                            <div>
                              <p className="text-sm text-gray-500">{event.status}</p>
                              {event.comment && (
                                <p className="mt-1 text-sm text-gray-700">{event.comment}</p>
                              )}
                            </div>
                            <div className="whitespace-nowrap text-right text-sm text-gray-500">
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default withAuth(ApplicationDetail);
