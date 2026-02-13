'use client';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

/** GlowingEffect와 동일한 무지개 색상 (하단 선 전용) */
const RAINBOW_GRADIENT =
  'linear-gradient(90deg, #dd7bbb, #d79f1e, #5a922c, #4c7894, #dd7bbb)';

/**
 * 상단 탭 버튼 - 아랫변(하단 선)만 표시
 * 1) 호버 시: 검은 선 대신 무지개 효과(하단만)
 * 2) 클릭(선택) 후: 검은색 선만 표시
 */
export default function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative py-4 px-2 font-normal tracking-tight text-base transition-colors ${
        active ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {/* 선택된 탭: 검은색 선만 */}
      {active && (
        <span
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
          aria-hidden
        />
      )}
      {/* 비선택 + 호버: 무지개 선만 (검은 선 없음) */}
      {!active && (
        <span
          className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 transition-opacity group-hover:opacity-100"
          style={{ background: RAINBOW_GRADIENT }}
          aria-hidden
        />
      )}
      {children}
    </button>
  );
}
