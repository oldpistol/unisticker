'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home,
  FileText,
  Users,
  UserPlus,
  Settings
} from 'lucide-react';

interface MenuItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

interface MenuBarProps {
  items?: MenuItem[];
}

const defaultItems: MenuItem[] = [
  {
    href: '/admin/dashboard',
    icon: <Home className="w-5 h-5" />,
    label: 'Dashboard'
  },
  {
    href: '/admin/applications',
    icon: <FileText className="w-5 h-5" />,
    label: 'Applications'
  },
  {
    href: '/admin/users',
    icon: <Users className="w-5 h-5" />,
    label: 'Users'
  },
  {
    href: '/admin/admins',
    icon: <UserPlus className="w-5 h-5" />,
    label: 'Admins'
  },
  {
    href: '/admin/settings',
    icon: <Settings className="w-5 h-5" />,
    label: 'Settings'
  },
];

export default function AdminMenuBar({ items = defaultItems }: MenuBarProps) {
  const pathname = usePathname();

  return (
    <div className="w-full bg-indigo-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex space-x-8">
          {items.map((item) => (
            <li key={item.label}>
              <Link 
                href={item.href}
                className={`flex items-center py-4 px-2 ${
                  pathname === item.href 
                    ? 'text-indigo-800 border-b-2 border-indigo-800'
                    : 'text-indigo-600 hover:text-indigo-800'
                }`}
              >
                <span className="text-current text-xl mr-2">{item.icon}</span>
                <span className="text-base">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 