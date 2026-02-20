interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-3xl md:text-4xl font-light tracking-[0.08em] text-[#111]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm mt-2 text-[#6B6B6B]">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
