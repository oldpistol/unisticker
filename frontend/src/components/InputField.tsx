interface InputFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  type?: string;
  error?: string;
  placeholder?: string;
  className?: string;
  options?: string[];
  multiline?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  error,
  required,
  className = "",
  placeholder,
  type = "text",
  options,
  multiline = false,
}) => {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === 'select' ? (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
          required={required}
          className={`block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select {label}</option>
          {options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : multiline ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void}
          required={required}
          placeholder={placeholder}
          rows={3}
          className={`block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
          required={required}
          placeholder={placeholder}
          className={`block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default InputField;
