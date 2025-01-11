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
import { toast } from 'sonner';

interface ApplicationDetail {
  id: number;
  student: {
    id: number;
    name: string;
    matricId: string;
    email: string;
    phoneNo: string;
  };
  vehicle: {
    id: number;
    plateNo: string;
    type: string;
    color: string;
    brand: string;
    model: string;
    isVehicleOwner: boolean;
    ownerFullName: string | null;
    roadTaxExpiryDate: string;
    insuranceName: string;
    insuranceNumber: string;
    drivingLicenseNo: string;
  };
  application: {
    status: string;
    submittedDate: string;
    expiryDate: string | null;
    remarks: string | null;
  };
  documents: {
    id: number;
    type: string;
    fileName: string;
    fileUrl: string;
    uploadedAt: string;
  }[];
}

const toTitleCase = (str: string) => {
  return str.toLowerCase().split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export default function ApplicationDetail() {
  const router = useRouter();
  const params = useParams();
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [viewUrl, setViewUrl] = useState('');

  const DocumentViewerModal = ({ url, onClose }: { url: string; onClose: () => void }) => {
    const isImage = url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 text-white hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {isImage ? (
            <img
              src={url}
              alt="Document Preview"
              className="max-h-[85vh] rounded-lg"
              style={{ maxWidth: '85vw' }}
            />
          ) : (
            <iframe 
              src={url} 
              className="w-[85vw] h-[85vh] rounded-lg bg-white" 
            />
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchApplicationDetail = async () => {
      const adminToken = localStorage.getItem('admin_token');
      if (!adminToken) {
        router.push('/admin/login');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/applications/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch application details');
        }

        const data = await response.json();
        setApplication(data.data);
      } catch (error) {
        console.error('Error fetching application details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicationDetail();
  }, [params.id, router]);

  const handleAction = async () => {
    if (!actionType || !remarks.trim()) return;

    setProcessing(true);
    const adminToken = localStorage.getItem('admin_token');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/applications/${params.id}/${actionType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ remarks })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${actionType} application`);
      }

      // Refresh the application data
      const responseRefresh = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/applications/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (!responseRefresh.ok) {
        throw new Error('Failed to fetch application details');
      }

      const dataRefresh = await responseRefresh.json();
      setApplication(dataRefresh.data);
      setShowRemarksModal(false);
      setRemarks('');
      setActionType(null);
      toast.success(`Application ${actionType}d successfully`);
    } catch (error) {
      console.error(`Error ${actionType}ing application:`, error);
      toast.error(error instanceof Error ? error.message : `Failed to ${actionType} application`);
    } finally {
      setProcessing(false);
    }
  };

  const openRemarksModal = (type: 'approve' | 'reject') => {
    setActionType(type);
    setRemarks('');
    setShowRemarksModal(true);
  };

  if (isLoading || !application) {
    return (
      <div className="min-h-screen bg-gray-50/30">
        <AdminNavbar />
        <AdminMenuBar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

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
                  Application #{application.id} • Submitted on {new Date(application.application.submittedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              {application?.application?.status === 'pending' && (
                <>
                  <button
                    onClick={() => openRemarksModal('reject')}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => openRemarksModal('approve')}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                  >
                    Approve
                  </button>
                </>
              )}
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
                  <p className="mt-1 text-sm font-medium text-gray-900">{application.student.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Student ID</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{application.student.matricId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{application.student.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{application.student.phoneNo}</p>
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
                  <p className="mt-1 text-sm font-medium text-gray-900">{application.vehicle.plateNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle Type</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{application.vehicle.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Brand & Model</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{application.vehicle.brand} {application.vehicle.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Color</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{application.vehicle.color}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle Owner</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {application.vehicle.isVehicleOwner ? 'Self' : application.vehicle.ownerFullName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Road Tax Expiry</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{application.vehicle.roadTaxExpiryDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Insurance Details</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {application.vehicle.insuranceName} ({application.vehicle.insuranceNumber})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Driving License</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{application.vehicle.drivingLicenseNo}</p>
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
                {application.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.type}</p>
                      <p className="text-sm text-gray-500">{doc.fileName}</p>
                    </div>
                    <button
                      onClick={async () => {
                        const adminToken = localStorage.getItem('admin_token');
                        if (!adminToken) {
                          router.push('/admin/login');
                          return;
                        }
                        
                        try {
                          const response = await fetch(doc.fileUrl, {
                            headers: {
                              'Authorization': `Bearer ${adminToken}`,
                              'Accept': '*/*'
                            }
                          });
                          
                          if (response.status === 403) {
                            throw new Error('Unauthorized to view this document');
                          }
                          
                          if (response.status === 404) {
                            throw new Error('Document not found');
                          }
                          
                          if (!response.ok || !response.body) {
                            throw new Error('Failed to download document');
                          }
                          
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          setViewUrl(url);
                          setShowModal(true);
                        } catch (error) {
                          console.error('Error downloading document:', error);
                          toast.error(error instanceof Error ? error.message : 'Failed to download document');
                        }
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-900"
                    >
                      View Document
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Application Status</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Current Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    application.application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    application.application.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {toTitleCase(application.application.status)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submitted Date</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {new Date(application.application.submittedDate).toLocaleDateString()}
                  </p>
                </div>
                {application.application.expiryDate && (
                  <div>
                    <p className="text-sm text-gray-500">Expiry Date</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {new Date(application.application.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {application.application.remarks && (
                  <div>
                    <p className="text-sm text-gray-500">Remarks</p>
                    <p className="mt-1 text-sm text-gray-900">{application.application.remarks}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {showRemarksModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {actionType === 'approve' ? 'Approve Application' : 'Reject Application'}
            </h3>
            <div className="mb-4">
              <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 mb-2">
                Remarks
              </label>
              <textarea
                id="remarks"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                disabled={processing}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRemarksModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                disabled={processing || !remarks.trim()}
              >
                {processing ? 'Processing...' : actionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
      {showModal && <DocumentViewerModal url={viewUrl} onClose={() => {
        setShowModal(false);
        window.URL.revokeObjectURL(viewUrl);
        setViewUrl('');
      }} />}
    </div>
  );
}