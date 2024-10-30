'use client';
import { useState, useEffect } from 'react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminMenuBar from '@/components/admin/AdminMenuBar';
import Table from '@/components/Table';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import { 
  Search, 
  Filter,
  Download,
  Mail,
  Phone,
  Tag,
  Building2
} from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

interface UserData {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  faculty: string;
  status: "Active" | "Inactive" | "Suspended";
  lastLogin: string;
}

const mockUsers: UserData[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phoneNumber: "012-3456789",
    faculty: "Engineering",
    status: "Active",
    lastLogin: "2024-03-15 14:30"
  },
  // Add more mock data as needed
];

export default function UsersManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  const itemsPerPage = 10;
  const totalItems = mockUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    setIsLoading(false);
    setLastUpdated(new Date().toLocaleString());
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const columns: Column<UserData>[] = [
    { 
      header: 'User Information', 
      accessor: (user: UserData) => (
        <div>
          <div className="font-medium text-gray-900">{user.name}</div>
          <div className="text-sm text-gray-500 flex items-center">
            <Mail className="h-4 w-4 mr-1" />
            {user.email}
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <Phone className="h-4 w-4 mr-1" />
            {user.phoneNumber}
          </div>
        </div>
      )
    },
    { 
      header: 'Faculty', 
      accessor: (user: UserData) => (
        <div className="text-sm text-gray-900">
          {user.faculty}
        </div>
      )
    },
    { 
      header: 'Last Login', 
      accessor: 'lastLogin'
    },
    { 
      header: 'Status', 
      accessor: (user: UserData) => (
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          user.status === "Active" 
            ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
            : user.status === "Inactive"
            ? "bg-gray-50 text-gray-700 ring-1 ring-gray-600/20"
            : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
        }`}>
          {user.status}
        </span>
      )
    },
    {
      header: 'Action',
      accessor: (user: UserData) => (
        <div className="flex items-center space-x-3">
          <Link 
            href={`/admin/users/${user.id}`} 
            className="text-sm font-medium text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md hover:bg-indigo-100 transition-colors"
          >
            View
          </Link>
          <Link 
            href={`/admin/users/${user.id}/edit`} 
            className="text-sm font-medium text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md hover:bg-indigo-100 transition-colors"
          >
            Edit
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/30">
      <AdminNavbar />
      <AdminMenuBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Users Management</h1>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <span>Total {totalItems} users</span>
                <span className="mx-2">•</span>
                <span>Updated {lastUpdated}</span>
              </div>
            </div>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {/* Add export logic */}}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Users
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or phone number"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="grid grid-cols-3 gap-6">
                  {/* Status Filter */}
                  <div className="space-y-1.5">
                    <label className="flex items-center text-sm text-gray-500 font-medium">
                      <Tag className="h-4 w-4 mr-2" />
                      Status
                    </label>
                    <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>

                  {/* Faculty Filter */}
                  <div className="space-y-1.5">
                    <label className="flex items-center text-sm text-gray-500 font-medium">
                      <Building2 className="h-4 w-4 mr-2" />
                      Faculty
                    </label>
                    <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="all">All Faculties</option>
                      <option value="engineering">Engineering</option>
                      <option value="science">Science</option>
                      <option value="computing">Computing</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-3">
                  <button 
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    onClick={() => {/* Reset filters logic */}}
                  >
                    Reset
                  </button>
                  <button 
                    className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => {/* Apply filters logic */}}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Users Table */}
        <Table data={mockUsers} columns={columns} />
        
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
    </div>
  );
} 