'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MenuBar from '@/components/MenuBar';
import { BackButton } from '@/components/BackButton';
import StatusBadge from '@/components/StatusBadge';
import InfoSection from '@/components/InfoSection';
import DocumentLink from '@/components/DocumentLink';
import { getActiveMenuItems } from '@/utils/navigation';

interface ApplicationDetails {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  fullName: string;
  matricNo: string;
  icNo: string;
  licenseNo: string;
  vehicleNo: string;
  documents: {
    ic: string;
    matric: string;
    license: string;
  };
}

export default function ApplicationDetails() {
  const { id } = useParams();
  const [application, setApplication] = useState<ApplicationDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchApplicationDetails = async () => {
      try {
        // Mock data for now
        const mockData: ApplicationDetails = {
          id: id as string,
          status: 'pending',
          submittedAt: new Date().toISOString(),
          fullName: 'John Doe',
          matricNo: 'A123456',
          icNo: '990101-01-1234',
          licenseNo: 'D123456',
          vehicleNo: 'ABC 1234',
          documents: {
            ic: '/mock/ic.pdf',
            matric: '/mock/matric.pdf',
            license: '/mock/license.pdf',
          },
        };
        setApplication(mockData);
      } catch (error) {
        console.error('Error fetching application:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Application not found</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <MenuBar items={getActiveMenuItems('/application')} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <BackButton href="/applications" label="Back to Applications" />

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-800">Application Details</h1>
          <StatusBadge status={application.status} />
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Application Info */}
          <div className="p-6 border-b">
            <div className="grid md:grid-cols-2 gap-6">
              <InfoSection
                title="Personal Information"
                items={[
                  { label: "Full Name", value: application.fullName },
                  { label: "Matric Number", value: application.matricNo },
                  { label: "IC Number", value: application.icNo },
                ]}
              />
              <InfoSection
                title="Vehicle Information"
                items={[
                  { label: "License Number", value: application.licenseNo },
                  { label: "Vehicle Number", value: application.vehicleNo },
                ]}
              />
            </div>
          </div>

          {/* Documents */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 pb-5">Submitted Documents</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(application.documents).map(([key, value]) => (
                <DocumentLink
                  key={key}
                  label={`${key} Document`}
                  href={value}
                />
              ))}
            </div>
          </div>

          {/* Application Timeline */}
          <div className="p-6 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800 pb-2 border-b mb-4">Application Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Application Submitted</p>
                  <p className="text-sm text-gray-500">
                    {new Date(application.submittedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
