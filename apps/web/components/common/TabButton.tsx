'use client';

import { GlowingEffect } from './GlowingEffect';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const RAINBOW_GRADIENT =
  'linear-gradient(90deg, #dd7bbb, #d79f1e, #5a922c, #4c7894, #dd7bbb)';

export default function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-visible py-3 md:py-4 px-1.5 md:px-2 font-normal text-xs md:text-sm transition-colors flex-shrink-0 ${
        active ? 'text-[#111]' : 'text-[#6B6B6B] hover:text-[#0057FF]'
      }`}
    >
      <GlowingEffect
        disabled={active}
        spread={12}
        movementDuration={1.5}
        inactiveZone={0.4}
        borderWidth={2}
        proximity={8}
      />
      {active && (
        <span
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#111]"
          aria-hidden
        />
      )}
      {!active && (
        <span
          className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 transition-opacity group-hover:opacity-100"
          style={{ background: RAINBOW_GRADIENT }}
          aria-hidden
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
