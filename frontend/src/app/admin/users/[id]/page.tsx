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
  Building2,
  MapPin,
  Clock,
  Car,
  FileText,
  AlertCircle
} from 'lucide-react';

interface UserDetail {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  faculty: string;
  address: string;
  status: "Active" | "Inactive" | "Suspended";
  lastLogin: string;
  registeredDate: string;
  activeVehicles: {
    vehicleNo: string;
    vehicleType: string;
    brand: string;
    model: string;
    color: string;
    stickerNo: string;
    expiryDate: string;
  }[];
  activityLog: {
    action: string;
    date: string;
    details?: string;
  }[];
}

// Mock data for demonstration
const mockUserDetail: UserDetail = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  phoneNumber: "012-3456789",
  faculty: "Engineering",
  address: "123, Jalan Universiti, 81310 Skudai, Johor",
  status: "Active",
  lastLogin: "2024-03-15 14:30:00",
  registeredDate: "2023-09-01",
  activeVehicles: [
    {
      vehicleNo: "JKD 1234",
      vehicleType: "Car",
      brand: "Toyota",
      model: "Camry",
      color: "Silver",
      stickerNo: "UTM-2024-0123",
      expiryDate: "2024-12-31"
    }
  ],
  activityLog: [
    { action: "Login", date: "2024-03-15 14:30:00" },
    { action: "Updated Profile", date: "2024-03-14 10:15:00" },
    { action: "Vehicle Registration", date: "2024-03-01 09:20:00", details: "Added new vehicle JKD 1234" }
  ]
};

export default function UserDetail() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<UserDetail['status']>(mockUserDetail.status);

  useEffect(() => {
    // Simulate API call to fetch user details
    setUser(mockUserDetail);
    setIsLoading(false);
  }, [params.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  const handleStatusUpdate = async () => {
    try {
      // Add your status update logic here
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
                href="/admin/users"
                className="mr-4 p-2 text-gray-400 hover:text-gray-500"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  User Details
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  User #{user.id} • Registered on {new Date(user.registeredDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link
                href={`/admin/users/${user.id}/edit`}
                className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-md hover:bg-indigo-100"
              >
                Edit User
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
          <div className="col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-400" />
                Basic Information
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{user.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Faculty</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{user.faculty}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{user.address}</p>
                </div>
              </div>
            </div>

            {/* Active Vehicles */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Car className="w-5 h-5 mr-2 text-gray-400" />
                Active Vehicles
              </h2>
              <div className="space-y-4">
                {user.activeVehicles.map((vehicle, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Vehicle Number</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">{vehicle.vehicleNo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Sticker Number</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">{vehicle.stickerNo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Vehicle Type</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">{vehicle.vehicleType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Brand & Model</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">{vehicle.brand} {vehicle.model}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Color</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">{vehicle.color}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Expiry Date</p>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {new Date(vehicle.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
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
                user.status === "Active" 
                  ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                  : user.status === "Inactive"
                  ? "bg-gray-50 text-gray-700 ring-1 ring-gray-600/20"
                  : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
              }`}>
                {user.status}
              </span>
            </div>

            {/* Activity Log */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-400" />
                Activity Log
              </h2>
              <div className="flow-root">
                <ul role="list" className="-mb-8">
                  {user.activityLog.map((activity, activityIdx) => (
                    <li key={activityIdx}>
                      <div className="relative pb-8">
                        {activityIdx !== user.activityLog.length - 1 ? (
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
                Update User Status
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as UserDetail['status'])}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
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