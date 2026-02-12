interface WriteButtonProps {
  onClick: () => void;
}

export default function WriteButton({ onClick }: WriteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#87CEEB] to-[#B0E0E6] hover:from-[#77BED5] hover:to-[#A0D8E1] text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      글쓰기
    </button>
  );
}
