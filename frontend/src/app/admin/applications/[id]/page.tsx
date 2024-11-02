'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminMenuBar from '@/components/admin/AdminMenuBar';
import Link from 'next/link';
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

interface ApplicationDetail {
  id: number;
  studentId: string;
  studentName: string;
  email: string;
  phoneNumber: string;
  faculty: string;
  address: string;
  vehicleNo: string;
  vehicleType: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleColor: string;
  submittedDate: string;
  status: "Pending" | "Approved" | "Rejected";
  documents: {
    type: string;
    url: string;
  }[];
  timeline: {
    status: string;
    date: string;
    comment?: string;
  }[];
}

// Mock data for demonstration
const mockApplicationDetail: ApplicationDetail = {
  id: 1,
  studentId: "A20EC0001",
  studentName: "Ahmad Ismail",
  email: "ahmad@example.com",
  phoneNumber: "012-3456789",
  faculty: "Engineering",
  address: "123, Jalan Universiti, 81310 Skudai, Johor",
  vehicleNo: "JKD 1234",
  vehicleType: "Car",
  vehicleBrand: "Toyota",
  vehicleModel: "Camry",
  vehicleColor: "Silver",
  submittedDate: "2024-03-15",
  status: "Pending",
  documents: [
    { type: "Vehicle Registration", url: "/docs/registration.pdf" },
    { type: "Insurance Certificate", url: "/docs/insurance.pdf" },
    { type: "Driver's License", url: "/docs/license.pdf" }
  ],
  timeline: [
    { status: "Submitted", date: "2024-03-15 09:30:00" },
    { status: "Under Review", date: "2024-03-15 14:20:00" }
  ]
};

export default function ApplicationDetail() {
  const router = useRouter();
  const params = useParams();
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updateStatus, setUpdateStatus] = useState<'Approved' | 'Rejected' | null>(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    // Simulate API call to fetch application details
    setApplication(mockApplicationDetail);
    setIsLoading(false);
  }, [params.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!application) {
    return <div>Application not found</div>;
  }

  const handleStatusUpdate = async () => {
    if (!updateStatus) return;
    
    try {
      // Add your status update logic here
      console.log('Updating status to:', updateStatus, 'with comment:', comment);
      router.push('/admin/applications');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <AdminNavbar />
      <AdminMenuBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/admin/applications"
                className="mr-4 p-2 text-gray-400 hover:text-gray-500"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Application Details
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Application #{application.id} • Submitted on {new Date(application.submittedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setUpdateStatus('Rejected')}
                className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100"
              >
                Reject
              </button>
              <button
                onClick={() => setUpdateStatus('Approved')}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Student Information */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-400" />
                Student Information
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Student Name</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{application.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Student ID</p>
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
              <h2 className="text-lg font-medium text-gray-900 mb-4">Status</h2>
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
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-400" />
                Timeline
              </h2>
              <div className="flow-root">
                <ul role="list" className="-mb-8">
                  {application.timeline.map((event, eventIdx) => (
                    <li key={eventIdx}>
                      <div className="relative pb-8">
                        {eventIdx !== application.timeline.length - 1 ? (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                              <Clock className="h-4 w-4 text-gray-500" />
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                            <div>
                              <p className="text-sm text-gray-500">{event.status}</p>
                              {event.comment && (
                                <p className="mt-1 text-sm text-gray-500">{event.comment}</p>
                              )}
                            </div>
                            <div className="whitespace-nowrap text-right text-sm text-gray-500">
                              {new Date(event.date).toLocaleString()}
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

        {/* Status Update Modal */}
        {updateStatus && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {updateStatus === 'Approved' ? 'Approve Application' : 'Reject Application'}
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment (optional)
                </label>
                <textarea
                  rows={4}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setUpdateStatus(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                    updateStatus === 'Approved'
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Confirm {updateStatus}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 