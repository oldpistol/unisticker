'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import MenuBar from '@/components/MenuBar';
import { getActiveMenuItems } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Table from '@/components/Table';
import Pagination from '@/components/Pagination';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

interface ApplicationData {
  id: number;
  year: number;
  vehicleNo: string;
  status: "Active" | "Expired" | "Pending" | "Rejected";
}

export default function Applications() {
  const pathname = usePathname();

  // Sample data
  const applications: ApplicationData[] = [
    { id: 1, year: 2024, vehicleNo: "ABC 1234", status: "Active" },
    { id: 2, year: 2024, vehicleNo: "DEF 5678", status: "Pending" },
    { id: 3, year: 2023, vehicleNo: "GHI 9012", status: "Expired" },
    { id: 4, year: 2024, vehicleNo: "JKL 3456", status: "Rejected" },
  ];

  const columns: Column<ApplicationData>[] = [
    { header: 'No', accessor: 'id' as keyof ApplicationData },
    { header: 'Year', accessor: 'year' as keyof ApplicationData },
    { header: 'Vehicle No', accessor: 'vehicleNo' as keyof ApplicationData },
    { 
      header: 'Status', 
      accessor: (application: ApplicationData) => (
        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
          application.status === "Active" 
            ? "bg-green-100 text-green-800"
            : application.status === "Pending"
            ? "bg-yellow-100 text-yellow-800"
            : application.status === "Rejected"
            ? "bg-red-100 text-red-800"
            : "bg-gray-100 text-gray-800"
        }`}>
          {application.status}
        </span>
      )
    },
    {
      header: 'Action',
      accessor: (application: ApplicationData) => (
        <div className="flex items-center space-x-4">
          <Link 
            href={`/applications/${application.id}`} 
            className="text-indigo-600 hover:text-indigo-900"
          >
            View
          </Link>
          {application.status !== "Active" && (
            <>
              <span className="text-gray-300">|</span>
              <Link 
                href={`/applications/${application.id}/edit`} 
                className="text-indigo-600 hover:text-indigo-900"
              >
                Edit
              </Link>
            </>
          )}
        </div>
      )
    }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = 50; // This would typically come from your API
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <MenuBar items={getActiveMenuItems(pathname)} />
      
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-800">My Applications</h1>
          <Link 
            href="/applications/new" 
            className="bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold text-base py-2 px-4 rounded inline-flex items-center gap-3 shadow-sm transition-colors"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>New Application</span>
          </Link>
        </div>

        <Table data={applications} columns={columns} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
}
