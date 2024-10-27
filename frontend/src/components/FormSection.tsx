import SectionTitle from './SectionTitle';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;  // Add this line
}

export default function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">{title}</h3>
      {children}
    </div>
  );
}
