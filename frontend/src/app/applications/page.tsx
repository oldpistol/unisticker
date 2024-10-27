'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import MenuBar from '@/components/MenuBar';
import { getActiveMenuItems } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

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

        {/* Table */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-indigo-500 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">No</th>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Year</th>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Vehicle No</th>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{application.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{application.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{application.vehicleNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </a>
            <a href="#" className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </a>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                <span className="font-medium">97</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
                {[1, 2, 3].map((page) => (
                  <a
                    key={page}
                    href="#"
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {page}
                  </a>
                ))}
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
