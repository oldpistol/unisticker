interface InputFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  error?: string;
  placeholder?: string;
}

export default function InputField({ 
  id, 
  name, 
  label, 
  value, 
  onChange, 
  required = false, 
  type = "text",
  error,
  placeholder
}: InputFieldProps) {
  return (
    <div className="relative mb-6">
      <label 
        className="block text-sm font-medium text-gray-700 mb-2" 
        htmlFor={id}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 rounded-md border
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }
          shadow-sm
          focus:outline-none focus:ring-2 focus:ring-opacity-50
          disabled:bg-gray-50 disabled:text-gray-500
          placeholder:text-gray-400
          text-base
          transition-colors
        `}
        required={required}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
