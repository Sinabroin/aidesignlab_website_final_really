/** 게시글 작성 모달 하단 버튼 영역 */
import { GlowingEffect } from '@/components/common/GlowingEffect';

interface WritePostFooterProps {
  onClose: () => void;
  onPublish: (e: React.FormEvent) => void;
  isPublishing: boolean;
  isEditMode?: boolean;
  /** 파일 업로드 진행 중 → 게시 버튼 비활성화 */
  isUploading?: boolean;
}

export default function WritePostFooter({
  onClose,
  onPublish,
  isPublishing,
  isEditMode,
  isUploading = false,
}: WritePostFooterProps) {
  const publishDisabled = isPublishing || isUploading;

  const publishLabel = isUploading
    ? '업로드 중…'
    : isPublishing
    ? (isEditMode ? '수정 중…' : '게시 중…')
    : (isEditMode ? '수정 완료' : '게시');

  return (
    <div className="flex-shrink-0 flex gap-3 p-6 pt-4 border-t bg-white">
      <button
        type="button"
        onClick={onClose}
        className="relative overflow-visible flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-normal tracking-tight rounded-none transition-colors"
      >
        <GlowingEffect disabled={false} spread={18} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
        <span className="relative z-10">취소</span>
      </button>
      <button
        type="submit"
        className="relative overflow-visible flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-normal tracking-tight rounded-none transition-colors"
      >
        <GlowingEffect disabled={false} spread={18} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
        <span className="relative z-10">임시저장</span>
      </button>
      <button
        type="button"
        onClick={onPublish}
        disabled={publishDisabled}
        className="relative overflow-visible flex-1 py-3 bg-[#111] hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-normal tracking-tight rounded-none transition-[background-color,opacity] shadow-lg"
      >
        <GlowingEffect disabled={publishDisabled} spread={18} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isUploading && (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {publishLabel}
        </span>
      </button>
    </div>
  );
}
