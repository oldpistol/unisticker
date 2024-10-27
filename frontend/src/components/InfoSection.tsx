interface InfoItem {
  label: string;
  value: string;
}

interface InfoSectionProps {
  title: string;
  items: InfoItem[];
}

export default function InfoSection({ title, items }: InfoSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 pb-2 border-b">{title}</h2>
      <dl className="space-y-3">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
            <dd className="mt-1 text-sm text-gray-900">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
