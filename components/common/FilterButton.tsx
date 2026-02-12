interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export default function FilterButton({ active, onClick, children }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
        active
          ? 'bg-[#87CEEB] text-white shadow-md'
          : 'bg-white text-gray-700 border border-gray-200 hover:border-[#87CEEB] hover:text-[#87CEEB]'
      }`}
    >
      {children}
    </button>
  );
}
