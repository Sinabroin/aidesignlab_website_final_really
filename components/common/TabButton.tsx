interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export default function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`py-4 px-2 font-semibold text-base border-b-2 transition-colors ${
        active
          ? 'border-[#87CEEB] text-[#4A90A4]'
          : 'border-transparent text-gray-600 hover:text-[#4A90A4]'
      }`}
    >
      {children}
    </button>
  );
}
