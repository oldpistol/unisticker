interface SectionTitleProps {
  title: string;
}

export default function SectionTitle({ title }: SectionTitleProps) {
  return (
    <h2 className="text-lg font-semibold text-gray-800 pb-2 border-b">
      {title}
    </h2>
  );
}
