'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminMenuBar from '@/components/admin/AdminMenuBar';
import Link from 'next/link';
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Shield,
  Clock,
  AlertCircle
} from 'lucide-react';

interface AdminDetail {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: "Super Admin" | "Admin" | "Manager";
  status: "Active" | "Inactive";
  lastLogin: string;
  registeredDate: string;
  activityLog: {
    action: string;
    date: string;
    details?: string;
  }[];
}

const mockAdminDetail: AdminDetail = {
  id: 1,
  name: "Admin User",
  email: "admin@example.com",
  phoneNumber: "012-3456789",
  role: "Super Admin",
  status: "Active",
  lastLogin: "2024-03-15 14:30:00",
  registeredDate: "2023-09-01",
  activityLog: [
    { action: "Login", date: "2024-03-15 14:30:00" },
    { action: "Updated User Status", date: "2024-03-14 10:15:00", details: "Changed user A20EC0001 status to Active" },
    { action: "Approved Application", date: "2024-03-14 09:20:00", details: "Approved vehicle permit application #123" }
  ]
};

export default function AdminDetail() {
  const router = useRouter();
  const params = useParams();
  const [admin, setAdmin] = useState<AdminDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<AdminDetail['status']>(mockAdminDetail.status);

  useEffect(() => {
    setAdmin(mockAdminDetail);
    setIsLoading(false);
  }, [params.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!admin) {
    return <div>Admin not found</div>;
  }

  const handleStatusUpdate = async () => {
    try {
      console.log('Updating status to:', newStatus);
      setShowStatusModal(false);
      router.refresh();
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
                href="/admin/admins"
                className="mr-4 p-2 text-gray-400 hover:text-gray-500"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Admin Details
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Admin #{admin.id} • Registered on {new Date(admin.registeredDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link
                href={`/admin/admins/${admin.id}/edit`}
                className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-md hover:bg-indigo-100"
              >
                Edit Admin
              </Link>
              <button
                onClick={() => setShowStatusModal(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2">
            {/* Basic Information */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-400" />
                Basic Information
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{admin.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{admin.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{admin.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="mt-1 text-sm font-medium">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      admin.role === "Super Admin" 
                        ? "bg-purple-50 text-purple-700 ring-1 ring-purple-600/20"
                        : admin.role === "Admin"
                        ? "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20"
                        : "bg-gray-50 text-gray-700 ring-1 ring-gray-600/20"
                    }`}>
                      <Shield className="w-4 h-4 mr-1" />
                      {admin.role}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Status</h2>
              <span className={`px-3 py-1 inline-flex text-sm font-medium rounded-full ${
                admin.status === "Active" 
                  ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                  : "bg-gray-50 text-gray-700 ring-1 ring-gray-600/20"
              }`}>
                {admin.status}
              </span>
              <p className="mt-2 text-sm text-gray-500">
                Last login: {new Date(admin.lastLogin).toLocaleString()}
              </p>
            </div>

            {/* Activity Log */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-400" />
                Activity Log
              </h2>
              <div className="flow-root">
                <ul role="list" className="-mb-8">
                  {admin.activityLog.map((activity, activityIdx) => (
                    <li key={activityIdx}>
                      <div className="relative pb-8">
                        {activityIdx !== admin.activityLog.length - 1 ? (
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
                              <p className="text-sm text-gray-500">{activity.action}</p>
                              {activity.details && (
                                <p className="mt-1 text-sm text-gray-500">{activity.details}</p>
                              )}
                            </div>
                            <div className="whitespace-nowrap text-right text-sm text-gray-500">
                              {new Date(activity.date).toLocaleString()}
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
        {showStatusModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Update Admin Status
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as AdminDetail['status'])}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 