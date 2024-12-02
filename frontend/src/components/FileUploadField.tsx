'use client';

import React, { useCallback } from 'react';
import { FileText, X } from 'lucide-react';

interface FileUploadFieldProps {
  id?: string;
  label: string;
  accept?: string;
  value?: File | null;
  onChange: (file: File | null) => void;
  name?: string;
  currentFile?: string | null;
  error?: File | null | undefined;
  required?: boolean;
}

export default function FileUploadField({
  id,
  label,
  accept,
  value,
  onChange,
  name,
  currentFile,
  error,
  required,
}: FileUploadFieldProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(null);
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check if the file type is accepted
      if (accept && accept.split(',').some(type => file.type.match(type.replace('.*', '').replace('.', '')))) {
        onChange(file);
      }
    }
  }, [accept, onChange]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <span className="text-xs text-gray-500">
          {accept && accept.split(',').map(ext => ext.replace('.', '').toUpperCase()).join(', ')}
        </span>
      </div>
      <div className="relative">
        <input
          type="file"
          id={id || name}
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            onChange(file || null);
          }}
          className="hidden"
        />
        <label
          htmlFor={id || name}
          className="block cursor-pointer"
        >
          <div 
            className="h-[200px] border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors relative group"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {value || currentFile ? (
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity z-10 flex items-center justify-center">
                  <div className="hidden group-hover:flex items-center gap-2 bg-white px-3 py-2 rounded-md shadow-sm">
                    <FileText className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Replace file</span>
                  </div>
                </div>
                {value && value.type.startsWith('image/') ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={URL.createObjectURL(value)}
                      alt={`${label} Preview`}
                      className="h-full w-full object-contain p-4"
                    />
                  </div>
                ) : currentFile ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText className="h-16 w-16 text-gray-400" />
                  </div>
                ) : null}
                <button
                  onClick={handleDelete}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors z-20"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
                <div className="absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-2 z-10">
                  <p className="text-sm text-gray-500 truncate">{value?.name || currentFile}</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <FileText className="h-12 w-12 text-gray-400" />
                <span className="mt-2 text-sm text-center text-gray-500">
                  Choose file or drag and drop
                </span>
              </div>
            )}
          </div>
        </label>
      </div>
    </div>
  );
}
