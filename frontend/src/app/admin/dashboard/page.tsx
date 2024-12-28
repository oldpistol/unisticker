'use client';
import { useState, useEffect } from 'react';
import { withAdminAuth } from '@/middleware/withAdminAuth';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminMenuBar from '@/components/admin/AdminMenuBar';
import { getActiveMenuItems } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Table from '@/components/Table';
import Pagination from '@/components/Pagination';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Sticker,
  ChevronRight
} from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

interface RecentApplication {
  id: number;
  studentId: string;
  vehicleNo: string;
  submittedDate: string;
  status: "Pending" | "Approved" | "Rejected";
}

function AdminDashboard() {
  const pathname = usePathname();
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchRecentApplications = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/recent-applications?page=${currentPage}&per_page=${itemsPerPage}`, 
          {
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData
          });
          throw new Error(`Failed to fetch recent applications: ${response.statusText}`);
        }

        const result = await response.json();
        
        // Extract pagination data from Laravel's response
        setTotalItems(result.meta.total);
        setTotalPages(result.meta.last_page);
        
        // Transform the API response to match our interface
        const transformedData = result.data.map((app: any) => ({
          id: app.id,
          studentId: app.user?.matric_id ?? '',
          vehicleNo: app.vehicle?.plate_no ?? '',
          submittedDate: app.created_at ? new Date(app.created_at).toISOString().split('T')[0] : '',
          status: app.status ?? 'Pending'
        }));
        
        setRecentApplications(transformedData);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentApplications();
  }, [currentPage, itemsPerPage]); // Re-fetch when page or items per page changes

  const columns: Column<RecentApplication>[] = [
    { header: 'Student ID', accessor: 'studentId' },
    { header: 'Vehicle No', accessor: 'vehicleNo' },
    { header: 'Submitted Date', accessor: 'submittedDate' },
    { 
      header: 'Status', 
      accessor: (application: RecentApplication) => {
        // Convert status to Title Case
        const titleCaseStatus = application.status.charAt(0).toUpperCase() + application.status.slice(1).toLowerCase();
        
        let statusStyle = '';
        switch (application.status.toLowerCase()) {
          case 'pending':
            statusStyle = 'bg-amber-50 text-amber-700';
            break;
          case 'approved':
            statusStyle = 'bg-emerald-50 text-emerald-700';
            break;
          case 'rejected':
            statusStyle = 'bg-rose-50 text-rose-600';
            break;
        }
        
        return (
          <span className={`px-4 py-1.5 inline-flex text-sm font-medium rounded-full ${statusStyle}`}>
            {titleCaseStatus}
          </span>
        );
      }
    },
    {
      header: 'Action',
      accessor: (application: RecentApplication) => (
        <div className="flex items-center space-x-3">
          <Link 
            href={`/admin/applications/${application.id}`} 
            className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md text-sm font-medium hover:bg-indigo-100 transition-colors duration-200"
          >
            Review
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <AdminMenuBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Total Applications</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">1,234</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="mt-2 flex items-center text-sm text-green-600">
              <span>↑ 12% from last month</span>
            </p>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Pending Review</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">45</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Approved Today</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">12</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Active Stickers</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">892</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Sticker className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Applications Section */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
              <Link 
                href="/admin/applications" 
                className="text-indigo-600 hover:text-indigo-900 font-medium inline-flex items-center"
              >
                View all
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {isLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-600 py-4">{error}</div>
            ) : (
              <Table data={recentApplications} columns={columns} />
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAdminAuth(AdminDashboard);