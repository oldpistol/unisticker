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
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900">Application not found</h2>
            <p className="mt-2 text-gray-600">The requested application could not be found.</p>
            <BackButton href="/applications" label="Return to Applications" className="mt-6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <MenuBar items={getActiveMenuItems('/application')} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton 
          href="/applications" 
          label="Back to Applications" 
          className="mb-4 text-indigo-600 hover:text-indigo-700" 
        />
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>
          <StatusBadge status={application.status} className="text-sm px-4 py-2" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Left 2 Columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Application Info Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Application Information</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <InfoSection
                    title="Personal Details"
                    items={[
                      { label: "Full Name", value: application.fullName },
                      { label: "Matric Number", value: application.matricNo },
                      { label: "IC Number", value: application.icNo },
                    ]}
                  />
                  <InfoSection
                    title="Vehicle Details"
                    items={[
                      { label: "License Number", value: application.licenseNo },
                      { label: "Vehicle Number", value: application.vehicleNo },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Documents Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Submitted Documents</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(application.documents).map(([key, value]) => (
                    <DocumentLink
                      key={key}
                      label={key.toUpperCase()}
                      href={value}
                      className="flex items-center p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Application Timeline</h2>
              <div className="space-y-6">
                <div className="relative pl-8 pb-6 border-l-2 border-indigo-200">
                  <div className="absolute left-[-9px] top-0">
                    <div className="h-4 w-4 rounded-full bg-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Application Submitted</p>
                    <time className="text-sm text-gray-500">
                      {new Date(application.submittedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </div>
                </div>
                {/* Add more timeline items here as needed */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
