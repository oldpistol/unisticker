'use client';

import { useState, useEffect } from 'react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminMenuBar from '@/components/admin/AdminMenuBar';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Car } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Vehicle {
  vehicle_number: string;
  sticker_number: string;
  vehicle_type: string;
  brand_model: string;
  color: string;
  expiry_date: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  phone_no: string;
  faculty: string;
  address?: {
    street_address: string;
    postcode: string;
    city: string;
    state: string;
  };
  status: 'Active' | 'Blocked';
  registered_at: string;
  active_vehicles: Vehicle[];
  ic_no?: string;
  passport_no?: string;
  matric_id?: string;
}

export default function UserDetails() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${params.id}`,
          {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const { data } = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [params.id, router]);

  const handleUpdateStatus = async () => {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      const token = localStorage.getItem('admin_token');
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${params.id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            status: user.status === 'Active' ? 'block' : 'unblock'
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const { data } = await response.json();
      setUser(prev => prev ? { ...prev, status: data.status } : null);
      setShowStatusModal(false);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/30">
        <AdminNavbar />
        <AdminMenuBar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50/30">
        <AdminNavbar />
        <AdminMenuBar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">User not found</h3>
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
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/users"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back to Users
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">User Details</h1>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/admin/users/${params.id}/edit`}
              className="px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Edit User
            </Link>
            <button
              onClick={() => setShowStatusModal(true)}
              className={`px-4 py-2 rounded-md text-white ${
                user.status === 'Active'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {user.status === 'Active' ? 'Block User' : 'Unblock User'}
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-base text-gray-900">{user.name || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-base text-gray-900">{user.email || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                <dd className="mt-1 text-base text-gray-900">{user.phone_no ? user.phone_no : '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Matric ID</dt>
                <dd className="mt-1 text-base text-gray-900">{user.matric_id || '-'}</dd>
              </div>
            </div>

            {/* Status and Registration */}
            <div className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      user.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Registered At</dt>
                <dd className="mt-1 text-base text-gray-900">{user.registered_at || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">IC Number</dt>
                <dd className="mt-1 text-base text-gray-900">{user.ic_no || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Passport Number</dt>
                <dd className="mt-1 text-base text-gray-900">{user.passport_no || '-'}</dd>
              </div>
              
            </div>

            {/* Address - Full Width */}
            <div className="col-span-1 md:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-base text-gray-900">
                {user.address ? 
                  `${user.address.street_address}, ${user.address.postcode} ${user.address.city}, ${user.address.state}` 
                  : 'No address provided'}
              </dd>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Car className="w-5 h-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Active Vehicles</h3>
          </div>
          {user.active_vehicles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#4F46E5]">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Vehicle Number
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Sticker Number
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Vehicle Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Brand & Model
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Color
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider">
                      Expiry Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {user.active_vehicles.map((vehicle, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vehicle.vehicle_number || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vehicle.sticker_number || 'Not issued'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vehicle.vehicle_type || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vehicle.brand_model || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vehicle.color || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {vehicle.expiry_date || 'Not set'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No active vehicles found.</p>
          )}
        </div>
      </main>

      {showStatusModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {user.status === 'Active' ? 'Block User' : 'Unblock User'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to {user.status === 'Active' ? 'block' : 'unblock'} this user?
              {user.status === 'Active' && ' This will prevent them from accessing the system.'}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  user.status === 'Active'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : user.status === 'Active' ? (
                  'Block User'
                ) : (
                  'Unblock User'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}