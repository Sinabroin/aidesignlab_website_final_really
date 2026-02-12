interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-lg text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
