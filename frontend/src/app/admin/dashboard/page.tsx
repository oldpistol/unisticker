'use client';
import { useState } from 'react';
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

export default function AdminDashboard() {
  const pathname = usePathname();

  // Sample data for recent applications
  const recentApplications: RecentApplication[] = [
    { id: 1, studentId: "A20EC0001", vehicleNo: "ABC 1234", submittedDate: "2024-03-15", status: "Pending" },
    { id: 2, studentId: "A20EC0002", vehicleNo: "DEF 5678", submittedDate: "2024-03-14", status: "Approved" },
    { id: 3, studentId: "A20EC0003", vehicleNo: "GHI 9012", submittedDate: "2024-03-14", status: "Rejected" },
    { id: 4, studentId: "A20EC0004", vehicleNo: "JKL 3456", submittedDate: "2024-03-13", status: "Pending" },
  ];

  const columns: Column<RecentApplication>[] = [
    { header: 'Student ID', accessor: 'studentId' },
    { header: 'Vehicle No', accessor: 'vehicleNo' },
    { header: 'Submitted Date', accessor: 'submittedDate' },
    { 
      header: 'Status', 
      accessor: (application: RecentApplication) => (
        <span className={`px-4 py-1.5 inline-flex text-sm font-medium rounded-full ${
          application.status === "Approved" 
            ? "bg-green-50 text-green-700 border border-green-100"
            : application.status === "Pending"
            ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
            : "bg-red-50 text-red-700 border border-red-100"
        }`}>
          {application.status}
        </span>
      )
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = 50;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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

            <Table data={recentApplications} columns={columns} />

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