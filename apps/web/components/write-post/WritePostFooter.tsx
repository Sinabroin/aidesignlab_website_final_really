/** 게시글 작성 모달 하단 버튼 영역 */
import { GlowingEffect } from '@/components/common/GlowingEffect';

interface WritePostFooterProps {
  onClose: () => void;
  onPublish: (e: React.FormEvent) => void;
  isPublishing: boolean;
  isEditMode?: boolean;
}

export default function WritePostFooter({ onClose, onPublish, isPublishing, isEditMode }: WritePostFooterProps) {
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
        disabled={isPublishing}
        className="relative overflow-visible flex-1 py-3 bg-[#111] hover:bg-gray-800 disabled:opacity-60 text-white font-normal tracking-tight rounded-none transition-[background-color,opacity] shadow-lg"
      >
        <GlowingEffect disabled={false} spread={18} movementDuration={1.5} inactiveZone={0.35} borderWidth={2} proximity={12} />
        <span className="relative z-10">{isPublishing ? (isEditMode ? '수정 중…' : '게시 중…') : (isEditMode ? '수정 완료' : '게시')}</span>
      </button>
    </div>
  );
}
