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
  AlertCircle
} from 'lucide-react';

interface AdminDetail {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "Super Admin" | "Admin";
  status: "Active" | "Blocked";
  blocked_at: string | null;
}

export default function AdminDetail() {
  const router = useRouter();
  const params = useParams();
  const [admin, setAdmin] = useState<AdminDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showUnblockModal, setShowUnblockModal] = useState(false);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/admins/${params.id}`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch admin details');
        }

        const data = await response.json();
        setAdmin(data);
      } catch (err) {
        setError('Failed to fetch admin details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmin();
  }, [params.id, router]);

  const handleBlock = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/admins/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...admin,
          status: 'Blocked'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to block admin');
      }

      const data = await response.json();
      setAdmin(data);
      setShowBlockModal(false);
    } catch (error) {
      setError('Failed to block admin');
    }
  };

  const handleUnblock = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/admins/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...admin,
          status: 'Active'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to unblock admin');
      }

      const data = await response.json();
      setAdmin(data);
      setShowUnblockModal(false);
    } catch (error) {
      setError('Failed to unblock admin');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/30">
        <AdminNavbar />
        <AdminMenuBar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50/30">
        <AdminNavbar />
        <AdminMenuBar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">Admin not found</div>
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
                  Admin #{admin.id}
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
              {admin.status === 'Active' ? (
                <button
                  onClick={() => setShowBlockModal(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Block
                </button>
              ) : (
                <button
                  onClick={() => setShowUnblockModal(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Unblock
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

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
                  <p className="mt-1 text-sm font-medium text-gray-900">{admin.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="mt-1 text-sm font-medium">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      admin.role === "Super Admin" 
                        ? "bg-purple-50 text-purple-700 ring-1 ring-purple-600/20"
                        : "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20"
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
          <div>
            {/* Status Card */}
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Status</h2>
              <span className={`px-3 py-1 inline-flex text-sm font-medium rounded-full ${
                admin.status === "Active" 
                  ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                  : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
              }`}>
                {admin.status}
              </span>
              {admin.blocked_at && (
                <p className="mt-2 text-sm text-gray-500">
                  Blocked at: {new Date(admin.blocked_at).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Block Confirmation Modal */}
        {showBlockModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Block Admin
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to block this admin? They will no longer be able to access the system.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowBlockModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBlock}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Block Admin
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Unblock Confirmation Modal */}
        {showUnblockModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Unblock Admin
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Are you sure you want to unblock this admin? They will regain access to the system.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowUnblockModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUnblock}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Unblock Admin
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}