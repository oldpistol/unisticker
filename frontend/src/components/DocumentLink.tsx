interface DocumentLinkProps {
  label: string;
  href: string;
}

export default function DocumentLink({ label, href }: DocumentLinkProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-medium text-gray-900 capitalize mb-2">{label}</h3>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
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
            d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"
          />
        </svg>
        View Document
      </a>
    </div>
  );
}
