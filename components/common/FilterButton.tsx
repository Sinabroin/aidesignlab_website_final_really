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
      className={`relative overflow-visible px-5 py-2 rounded-none text-sm font-normal tracking-tight transition-colors ${
        active
          ? 'bg-gray-900 text-white shadow-md'
          : 'bg-white text-gray-700 border-[1.5px] border-gray-200 hover:text-gray-900'
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
