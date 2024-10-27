'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface NavbarProps {
  userName?: string;
  // Add other props as needed
}

export default function Navbar({ userName }: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <Link href="/applications" className="flex items-center py-4 px-2">
              <svg 
                className="w-6 h-6 text-[#4F46E5] mr-2"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
              <span className="font-semibold text-[#4F46E5] text-lg">UniSticker</span>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)} 
                className="flex items-center focus:outline-none"
              >
                <svg 
                  className="w-7 h-7 text-[#4F46E5]"
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM12 6c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z" 
                    fill="currentColor"
                  />
                </svg>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                  <a href="/profile" className="block px-4 py-2 text-base text-gray-700 hover:bg-indigo-50">Profile</a>
                  <a href="#" className="block px-4 py-2 text-base text-gray-700 hover:bg-indigo-50">Sign out</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
