import { useState, useEffect } from 'react';

interface FileUploadProps {
  name: string;
  label: string;
  description: string;
  onFileChange: (name: string, file: File) => void;
  currentFile: File | null;
  existingUrl?: string;
}

export const FileUploadBox = ({ name, label, description, onFileChange, currentFile, existingUrl }: FileUploadProps) => {
  const [error, setError] = useState<string>('');
  const [preview, setPreview] = useState<string | null>(existingUrl || null);

  const validateFileType = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload only images (JPG, PNG) or PDF files');
      return false;
    }
    setError('');
    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (validateFileType(file)) {
        onFileChange(name, file);
        
        // Create preview
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        } else if (file.type === 'application/pdf') {
          setPreview('pdf');
        }
      } else {
        event.target.value = ''; // Reset input if invalid file
        setPreview(null);
      }
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (preview && preview !== 'pdf') {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex flex-col space-y-2">
        <input
          type="file"
          name={name}
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.pdf"
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
          required
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        
        {/* Preview Section */}
        {(currentFile || existingUrl) && !error && (
          <div className="mt-2">
            <div className="text-sm text-gray-600 mb-2">
              Selected: <span className="font-medium text-indigo-600">
                {currentFile?.name || existingUrl}
              </span>
            </div>
            
            {preview && (
              <div className="border rounded-lg p-2 bg-gray-50">
                {preview === 'pdf' ? (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 16H8V8h4v8zm2 0V8h4v8h-4zm5-12H5a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 18H5V6h14v16z"/>
                    </svg>
                    <span>PDF Document</span>
                  </div>
                ) : (
                  <img 
                    src={preview} 
                    alt="File preview" 
                    className="max-h-40 rounded-lg mx-auto"
                  />
                )}
              </div>
            )}
          </div>
        )}
        
        <p className="text-xs text-gray-500">
          Accepted formats: PDF, JPG, PNG
        </p>
      </div>
    </div>
  );
};
