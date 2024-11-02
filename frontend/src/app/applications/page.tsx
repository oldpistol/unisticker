'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MenuBar from '@/components/MenuBar';
import { getActiveMenuItems } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Table from '@/components/Table';
import Pagination from '@/components/Pagination';
import { 
  Plus, 
  Search, 
  Filter,
  Car,
  Calendar,
  Tag,
  Building2,
  Eye,
  Edit2
} from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

interface ApplicationData {
  id: number;
  year: number;
  vehicleNo: string;
  status: "Active" | "Expired" | "Pending" | "Rejected" | "Draft";
}

export default function Applications() {
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use useEffect to set initial values on client
  useEffect(() => {
    setSearchTerm('');
  }, []);

  // Render null or loading state if searchTerm is undefined
  if (typeof searchTerm === 'undefined') {
    return null; // or a loading spinner
  }

  // Sample data
  const applications: ApplicationData[] = [
    { id: 1, year: 2024, vehicleNo: "ABC 1234", status: "Active" },
    { id: 4, year: 2024, vehicleNo: "JHP 179", status: "Draft" },
    { id: 2, year: 2024, vehicleNo: "DEF 5678", status: "Pending" },
    { id: 3, year: 2023, vehicleNo: "GHI 9012", status: "Expired" },
    { id: 4, year: 2024, vehicleNo: "JKL 3456", status: "Rejected" },
  ];

  const totalItems = applications.length;
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
            : application.status === "Draft"
            ? "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20"
            : "bg-slate-50 text-slate-700 ring-1 ring-slate-600/20"
        }`}>
          {application.status}
        </span>
      )
    },
    {
      header: 'Action',
      accessor: (application: ApplicationData) => (
        <div className="flex items-center">
          <Link 
            href={`/applications/${application.id}`} 
            className="px-2 py-0.5 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-200 mr-2"
          >
            View
          </Link>
          {application.status === "Draft" && (
            <Link 
              href={`/applications/${application.id}/edit`} 
              className="px-2 py-0.5 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-200"
            >
              Edit
            </Link>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Navbar />
      <MenuBar items={getActiveMenuItems(pathname)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">My Applications</h1>
              <div className="mt-1 flex items-center text-sm text-gray-500">
                <span>Total {totalItems} applications</span>
              </div>
            </div>
            <Link
              href="/applications/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Link>
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
                placeholder="Search by vehicle number or year"
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
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>

                  {/* Vehicle Type Filter */}
                  <div className="space-y-1.5">
                    <label className="flex items-center text-sm text-gray-500 font-medium">
                      <Car className="h-4 w-4 mr-2" />
                      Vehicle Type
                    </label>
                    <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="all">All Types</option>
                      <option value="car">Car</option>
                      <option value="motorcycle">Motorcycle</option>
                    </select>
                  </div>

                  {/* Year Filter */}
                  <div className="space-y-1.5">
                    <label className="flex items-center text-sm text-gray-500 font-medium">
                      <Calendar className="h-4 w-4 mr-2" />
                      Year
                    </label>
                    <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="all">All Years</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
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
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <Table data={applications} columns={columns} />
        </div>
        
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
