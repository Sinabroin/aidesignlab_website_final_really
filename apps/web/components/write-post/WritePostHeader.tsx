/** 게시글 작성/수정 모달 헤더 */
interface WritePostHeaderProps {
  onClose: () => void;
  isEditMode?: boolean;
}

export default function WritePostHeader({ onClose, isEditMode }: WritePostHeaderProps) {
  return (
    <div className="flex-shrink-0 bg-[#111] p-6 rounded-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-none flex items-center justify-center">
            <svg className="w-7 h-7 text-white" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <h2 className="text-2xl font-normal tracking-tight text-white">{isEditMode ? '게시글 수정' : '새 게시글 작성'}</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="닫기"
          className="w-10 h-10 rounded-none bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <svg className="w-6 h-6 text-white" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
