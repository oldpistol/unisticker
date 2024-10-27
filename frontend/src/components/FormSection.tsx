import SectionTitle from './SectionTitle';

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className="space-y-4">
      <SectionTitle title={title} />
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}
