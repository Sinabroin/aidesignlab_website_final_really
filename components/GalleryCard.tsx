'use client';

interface GalleryCardProps {
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  imageUrl?: string;
  onClick?: () => void;
}

/**
 * Siteinspire 스타일의 갤러리 카드 컴포넌트
 * 
 * 넓은 카드와 깔끔한 타이포그래피로 모던한 느낌
 */
export default function GalleryCard({
  title,
  description,
  author,
  date,
  category,
  imageUrl,
  onClick
}: GalleryCardProps) {
  // 카테고리별 이모티콘
  const getCategoryIcon = (cat: string) => {
    const icons: Record<string, string> = {
      'Workshop': '🎨',
      'Seminar': '💡',
      'Contest': '🏆',
      'Networking': '🤝',
      'Safety': '🛡️',
      'Planning': '📊',
      'AI System': '🤖',
      'Design': '✨',
      'Data': '📈',
      'Training': '🎓',
      'Usecase': '💼',
      'Trend': '📈',
      'Prompt': '⚡',
      'HAI': '🚀'
    };
    return icons[cat] || '✨';
  };

  return (
    <div
      className="group cursor-pointer"
      onClick={onClick}
    >
      {/* 이미지 영역 */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-4 bg-gradient-to-br from-[#e8f4f8] via-[#c8dff0] to-[#aacae6]">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center relative">
            {/* 배경 장식 */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-5 left-5 w-20 h-20 bg-white rounded-full blur-2xl"></div>
              <div className="absolute bottom-5 right-5 w-24 h-24 bg-[#00aad2] rounded-full blur-2xl"></div>
            </div>
            {/* 이모티콘 */}
            <span className="text-7xl opacity-40 relative z-10 drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
              {getCategoryIcon(category)}
            </span>
          </div>
        )}
        
        {/* 서브틀한 오버레이 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      {/* 정보 영역 - 항상 보임 */}
      <div className="px-1">
        {/* 카테고리 */}
        <div className="mb-2">
          <span className="text-xs font-semibold text-[#00aad2] uppercase tracking-wider">
            {category}
          </span>
        </div>

        {/* 타이틀 */}
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#00aad2] transition-colors">
          {title}
        </h3>
        
        {/* 설명 */}
        <p className="text-sm md:text-base text-gray-600 mb-3 line-clamp-2">
          {description}
        </p>
        
        {/* 메타 정보 */}
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="font-medium">{author}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}
