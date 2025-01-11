'use client';

import { useState, useEffect } from 'react';
import { withAdminAuth } from '@/middleware/withAdminAuth';
import AdminMenuBar from '@/components/admin/AdminMenuBar';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import { 
  Search, 
  Filter,
  Download,
  Calendar,
  GraduationCap,
  Building2,
  Tag
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

interface Application {
  id: number;
  studentId: string;
  studentName: string;
  vehicleNo: string;
  submittedDate: string;
  status: "Pending" | "Approved" | "Rejected";
  vehicleType: string;
  faculty: string;
}

export default withAdminAuth(function ApplicationsList() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [lastUpdated, setLastUpdated] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    vehicleType: 'all',
    dateRange: 'all'
  });
  const router = useRouter();

  // Helper function for Title Case
  const toTitleCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        per_page: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.vehicleType !== 'all' && { vehicle_type: filters.vehicleType }),
        ...(filters.dateRange !== 'all' && { date_range: filters.dateRange })
      });

      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/applications?${queryParams}`;
      console.log('Fetching applications from:', url);

      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to fetch applications: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Raw API Response:', JSON.stringify(data, null, 2));
      console.log('Applications array:', data.data);
      console.log('Meta information:', data.meta);

      if (!Array.isArray(data.data)) {
        console.error('API response data is not an array:', data.data);
        throw new Error('Invalid API response format: data is not an array');
      }

      setApplications(data.data || []);
      setTotalItems(data.meta?.total || 0);
      setTotalPages(data.meta?.last_page || 1);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Error fetching applications:', error);
      // Optionally show error to user here
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const queryParams = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.vehicleType !== 'all' && { vehicle_type: filters.vehicleType }),
        ...(filters.dateRange !== 'all' && { date_range: filters.dateRange })
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/applications/export?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : 'applications.csv';

      // Create blob from response and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting applications:', error);
      // You could add a toast notification here
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [currentPage, searchTerm, filters]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      vehicleType: 'all',
      dateRange: 'all'
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const columns: Column<Application>[] = [
    {
      header: 'Student ID',
      accessor: (row: any) => (
        <Link 
          href={`/admin/applications/${row.id}`}
          className="text-indigo-600 hover:text-indigo-900"
        >
          {row.studentId}
        </Link>
      ),
    },
    {
      header: 'Student Name',
      accessor: 'studentName',
    },
    {
      header: 'Vehicle No.',
      accessor: 'vehicleNo',
    },
    {
      header: 'Vehicle Type',
      accessor: 'vehicleType',
    },
    {
      header: 'Submitted Date',
      accessor: (row: any) => {
        const date = new Date(row.submittedDate);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    },
    {
      header: 'Status',
      accessor: (row: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.status.toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-800' :
          row.status.toLowerCase() === 'approved' ? 'bg-emerald-100 text-emerald-800' :
          row.status.toLowerCase() === 'rejected' ? 'bg-rose-100 text-rose-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {toTitleCase(row.status)}
        </span>
      )
    },
    {
      header: 'Action',
      accessor: (application: Application) => (
        <div className="flex items-center space-x-3">
          <Link 
            href={`/admin/applications/${application.id}`} 
            className="text-sm font-medium text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md hover:bg-indigo-100 transition-colors"
          >
            Review
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/30">
      <AdminMenuBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Applications</h1>
              <p className="mt-1 text-sm text-gray-500">
                Total {totalItems} applications • Updated {lastUpdated}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Search and Quick Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by student name, ID, or vehicle number"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium
                  ${isFilterOpen 
                    ? 'border-indigo-500 text-indigo-600 bg-indigo-50 hover:bg-indigo-100' 
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {isFilterOpen && (
            <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="grid grid-cols-4 gap-6">
                  {/* Status Filter */}
                  <div className="space-y-1.5">
                    <label className="flex items-center text-sm text-gray-500 font-medium">
                      <Tag className="h-4 w-4 mr-2" />
                      Status
                    </label>
                    <select 
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Vehicle Type Filter */}
                  <div className="space-y-1.5">
                    <label className="flex items-center text-sm text-gray-500 font-medium">
                      <Building2 className="h-4 w-4 mr-2" />
                      Vehicle Type
                    </label>
                    <select 
                      value={filters.vehicleType}
                      onChange={(e) => handleFilterChange('vehicleType', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all">All Types</option>
                      <option value="Car">Car</option>
                      <option value="Motorcycle">Motorcycle</option>
                    </select>
                  </div>

                  {/* Date Range Filter */}
                  <div className="space-y-1.5">
                    <label className="flex items-center text-sm text-gray-500 font-medium">
                      <Calendar className="h-4 w-4 mr-2" />
                      Date Range
                    </label>
                    <select 
                      value={filters.dateRange}
                      onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button 
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    onClick={handleResetFilters}
                  >
                    Reset
                  </button>
                  <button 
                    className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Applications Table */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
            No applications found
          </div>
        ) : (
          <>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#4F46E5]">
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        scope="col"
                        className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider"
                      >
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application, index) => (
                    <tr key={application.id || index} className="hover:bg-gray-50">
                      {columns.map((column, colIndex) => (
                        <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {typeof column.accessor === 'function'
                            ? column.accessor(application)
                            : application[column.accessor]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={10}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
});