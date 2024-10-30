import SectionTitle from './SectionTitle';

interface FormSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
      {children}
    </div>
  );
}
