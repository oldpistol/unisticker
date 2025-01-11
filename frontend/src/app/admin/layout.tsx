'use client';

import AdminNavbar from '@/components/admin/AdminNavbar';
import ChatModal from '@/components/admin/ChatModal';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <AdminNavbar />
      {children}
      <ChatModal />
    </div>
  );
}
