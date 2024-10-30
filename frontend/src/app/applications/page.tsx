'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import MenuBar from '@/components/MenuBar';
import { getActiveMenuItems } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Table from '@/components/Table';
import Pagination from '@/components/Pagination';
import { Plus, Eye, Edit2 } from 'lucide-react';

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
    { 
      header: 'No', 
      accessor: (application) => (
        <div className="pl-4">{application.id}</div>
      )
    },
    { 
      header: 'Year', 
      accessor: (application) => (
        <div className="pl-4">{application.year}</div>
      )
    },
    { header: 'Vehicle No', accessor: 'vehicleNo' },
    { 
      header: 'Status', 
      accessor: (application: ApplicationData) => (
        <span className={`px-4 py-1.5 inline-flex text-sm leading-5 font-medium rounded-full ${
          application.status === "Active" 
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
            : application.status === "Pending"
            ? "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20"
            : application.status === "Rejected"
            ? "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20"
            : "bg-slate-50 text-slate-700 ring-1 ring-slate-600/20"
        }`}>
          {application.status}
        </span>
      )
    },
    {
      header: 'Action',
      accessor: (application: ApplicationData) => (
        <div className="flex items-center gap-2">
          <Link 
            href={`/applications/${application.id}`} 
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
          >
            <Eye className="w-4 h-4" />
            View
          </Link>
          {application.status !== "Active" && (
            <Link 
              href={`/applications/${application.id}/edit`} 
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </Link>
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
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <MenuBar items={getActiveMenuItems(pathname)} />
      
      <main className="max-w-7xl mx-auto py-8">
        <div className="p-6 flex justify-between items-center border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">My Applications</h1>
            <p className="mt-1 text-sm text-slate-500">Manage and track your vehicle permit applications</p>
          </div>
          <Link 
            href="/applications/new" 
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Application
          </Link>
        </div>

        <div className="p-6">
          <Table 
            data={applications} 
            columns={columns}
            className="border border-slate-200 rounded-lg overflow-hidden"
          />

          <div className="mt-6">
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
