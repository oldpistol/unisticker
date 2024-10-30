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
  Calendar,
  GraduationCap,
  Building2,
  Tag
} from 'lucide-react';

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

const mockApplications: Application[] = [
  {
    id: 1,
    studentId: "A20EC0001",
    studentName: "Ahmad Ismail",
    vehicleNo: "JKD 1234",
    submittedDate: "2024-03-15",
    status: "Pending",
    vehicleType: "Car",
    faculty: "Engineering"
  },
  {
    id: 2,
    studentId: "A20SC0045",
    studentName: "Sarah Abdullah",
    vehicleNo: "WXC 5522",
    submittedDate: "2024-03-14",
    status: "Approved",
    vehicleType: "Motorcycle",
    faculty: "Science"
  },
  {
    id: 3,
    studentId: "A20MB0132",
    studentName: "Muhammad Ali",
    vehicleNo: "VBN 7788",
    submittedDate: "2024-03-14",
    status: "Rejected",
    vehicleType: "Car",
    faculty: "Management"
  },
  {
    id: 4,
    studentId: "A20CS0078",
    studentName: "Nurul Aina",
    vehicleNo: "JKL 3456",
    submittedDate: "2024-03-13",
    status: "Pending",
    vehicleType: "Motorcycle",
    faculty: "Computing"
  },
  {
    id: 5,
    studentId: "A20EC0089",
    studentName: "Tan Wei Ming",
    vehicleNo: "PHD 9012",
    submittedDate: "2024-03-13",
    status: "Approved",
    vehicleType: "Car",
    faculty: "Engineering"
  },
  {
    id: 6,
    studentId: "A20ME0023",
    studentName: "Raj Kumar",
    vehicleNo: "WRT 4567",
    submittedDate: "2024-03-12",
    status: "Pending",
    vehicleType: "Car",
    faculty: "Engineering"
  },
  {
    id: 7,
    studentId: "A20SC0167",
    studentName: "Lisa Wong",
    vehicleNo: "BNM 8899",
    submittedDate: "2024-03-12",
    status: "Approved",
    vehicleType: "Motorcycle",
    faculty: "Science"
  },
  {
    id: 8,
    studentId: "A20IS0198",
    studentName: "Amir Hassan",
    vehicleNo: "QWE 2468",
    submittedDate: "2024-03-11",
    status: "Rejected",
    vehicleType: "Car",
    faculty: "Islamic Studies"
  },
  {
    id: 9,
    studentId: "A20EC0234",
    studentName: "Siti Aminah",
    vehicleNo: "KLM 1357",
    submittedDate: "2024-03-11",
    status: "Pending",
    vehicleType: "Motorcycle",
    faculty: "Engineering"
  },
  {
    id: 10,
    studentId: "A20MB0321",
    studentName: "Daniel Lee",
    vehicleNo: "PLS 7890",
    submittedDate: "2024-03-10",
    status: "Approved",
    vehicleType: "Car",
    faculty: "Management"
  }
];

export default function ApplicationsList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const itemsPerPage = 10;
  const totalItems = mockApplications.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Use the mock data in your component
  const applications = mockApplications;

  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Your window-dependent code here
    }
  }, []);

  useEffect(() => {
    // Handle time-sensitive operations here
    setLastUpdated(new Date().toLocaleString());
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const columns: Column<Application>[] = [
    { 
      header: 'Student Information', 
      accessor: (application: Application) => (
        <div>
          <div className="font-medium text-gray-900">{application.studentName}</div>
          <div className="text-sm text-gray-500">{application.studentId}</div>
          <div className="text-sm text-gray-500">{application.faculty}</div>
        </div>
      )
    },
    {
      header: 'Vehicle Details',
      accessor: (application: Application) => (
        <div>
          <div className="font-medium text-gray-900">{application.vehicleNo}</div>
          <div className="text-sm text-gray-500">{application.vehicleType}</div>
        </div>
      )
    },
    { 
      header: 'Submitted Date', 
      accessor: (application: Application) => (
        <div className="text-sm text-gray-900">
          {new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }).format(new Date(application.submittedDate))}
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: (application: Application) => (
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          application.status === "Approved" 
            ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
            : application.status === "Pending"
            ? "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20"
            : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
        }`}>
          {application.status}
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
      <AdminNavbar />
      <AdminMenuBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Applications</h1>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <span>Total 2,420 applications</span>
                <span className="mx-2">•</span>
                <span>Updated {lastUpdated}</span>
              </div>
            </div>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {/* Add export logic */}}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
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
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Vehicle Type Filter */}
                  <div className="space-y-1.5">
                    <label className="flex items-center text-sm text-gray-500 font-medium">
                      <Building2 className="h-4 w-4 mr-2" />
                      Vehicle Type
                    </label>
                    <select 
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all">All Types</option>
                      <option value="car">Car</option>
                      <option value="motorcycle">Motorcycle</option>
                    </select>
                  </div>

                  {/* Faculty Filter */}
                  <div className="space-y-1.5">
                    <label className="flex items-center text-sm text-gray-500 font-medium">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Faculty
                    </label>
                    <select 
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all">All Faculties</option>
                      <option value="engineering">Engineering</option>
                      <option value="science">Science</option>
                      <option value="computing">Computing</option>
                      <option value="management">Management</option>
                      <option value="islamic-studies">Islamic Studies</option>
                    </select>
                  </div>

                  {/* Date Range Filter */}
                  <div className="space-y-1.5">
                    <label className="flex items-center text-sm text-gray-500 font-medium">
                      <Calendar className="h-4 w-4 mr-2" />
                      Date Range
                    </label>
                    <select 
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

        {/* Applications Table */}
        <Table data={applications} columns={columns} />
        
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