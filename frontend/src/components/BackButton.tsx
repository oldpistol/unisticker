import Link from 'next/link';

interface BackButtonProps {
  href?: string;  // Make href optional by adding ?
  label?: string; // Make label optional by adding ?
}

export const BackButton = ({ 
  href = '/applications',
  label = 'Back'
}: BackButtonProps) => {
  return (
    <div className="mb-4">
      <Link 
        href={href}
        className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
      >
        <svg 
          className="w-4 h-4 mr-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {label}
      </Link>
    </div>
  );
}
