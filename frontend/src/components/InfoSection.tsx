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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 pb-3 flex items-center">
        {title}
      </h2>
      <dl className="grid gap-6">
        {items.map((item) => (
          <div 
            key={item.label} 
            className="group relative pl-4 transition-all duration-200 hover:translate-x-2"
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-gray-100 group-hover:bg-gray-300 transition-colors duration-200 rounded-full" />
            <dt className="text-sm font-medium text-gray-500 mb-1.5">{item.label}</dt>
            <dd className="text-base text-gray-900 font-medium tracking-wide">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
