'use client';

import React from 'react';
import { LucideIcon, LayoutGrid, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface MenuItem {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
}

interface MenuBarProps {
  items?: MenuItem[];
}

const defaultItems: MenuItem[] = [
  {
    href: "/applications",
    icon: LayoutGrid,
    label: "Applications",
    isActive: false
  },
  {
    href: "/chatbot",
    icon: MessageSquare,
    label: "ChatBot",
    isActive: false
  }
];

export default function MenuBar({ items = defaultItems }: MenuBarProps) {
  return (
    <div className="w-full bg-indigo-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex space-x-8">
          {items.map((item, index) => {
            return (
              <li key={index}>
                <Link 
                  href={item.href} 
                  className={`flex items-center py-4 px-2 ${
                    item.isActive 
                      ? 'text-indigo-800 border-b-2 border-indigo-800'
                      : 'text-indigo-600 hover:text-indigo-800'
                  }`}
                >
                  {React.createElement(item.icon, { className: "h-5 w-5 mr-2", "aria-hidden": "true" })}
                  <span className="text-base">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
