'use client';

import { GlowingEffect } from './GlowingEffect';

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export default function FilterButton({ active, onClick, children }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-visible px-5 py-2 rounded-none text-sm font-normal transition-all duration-200 ${
        active
          ? 'bg-[#111] text-white'
          : 'bg-white text-[#6B6B6B] border border-[#D9D6D3] hover:border-[#6B6B6B] hover:text-[#111]'
      }`}
    >
      <GlowingEffect
        disabled={false}
        spread={18}
        movementDuration={1.5}
        inactiveZone={0.35}
        borderWidth={3}
        proximity={12}
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
