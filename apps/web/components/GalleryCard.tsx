"use client";

import Image from "next/image";

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
import { GlowingEffect } from "@/components/common/GlowingEffect";
import { COLORS } from "@/lib/constants";

interface GalleryCardProps {
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  imageUrl?: string;
  readMoreLink?: string;
  onClick?: () => void;
}

const PLACEHOLDER_IMAGES: Record<string, string> = {
  Workshop:
    "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h1.jpg",
  Data: "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h2.jpg",
  Usecase:
    "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h4.jpg",
  Trend: "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h2.jpg",
  Prompt: "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h1.jpg",
  HAI: "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h4.jpg",
  Teams: "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h2.jpg",
  Safety: "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h1.jpg",
  Planning:
    "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h4.jpg",
  "AI System":
    "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h4.jpg",
  Design: "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h1.jpg",
};

/**
 * 앨범형 갤러리 카드 + GlowingEffect (마우스 따라다니는 무지개 테두리)
 * 랜딩 페이지 제외, PlayDay/PlayBook/Community 섹션용
 */
export default function GalleryCard({
  title,
  description,
  author,
  date,
  category,
  imageUrl,
  readMoreLink = "#",
  onClick,
}: GalleryCardProps) {
  const imageSrc =
    imageUrl || PLACEHOLDER_IMAGES[category] || PLACEHOLDER_IMAGES.Workshop;

  const handleClick = () => {
    if (onClick) onClick();
    else if (readMoreLink && readMoreLink !== "#")
      window.location.href = readMoreLink;
  };

  return (
    <div
      className="group relative cursor-pointer rounded-none"
      onClick={handleClick}
    >
      <div className="relative rounded-none border border-gray-300/50 bg-white/50 shadow-none backdrop-blur-sm transition-shadow hover:shadow-md dark:border-gray-800/50 dark:bg-gray-950/50">
        <GlowingEffect
          disabled={false}
          spread={24}
          movementDuration={1.5}
          inactiveZone={0.2}
          borderWidth={4}
          proximity={20}
        />

        <div className="overflow-hidden rounded-none p-0">
          <div className="relative mb-4 sm:mb-6">
            <div className="relative aspect-square h-64 w-full overflow-hidden sm:h-72 md:h-80">
              {imageUrl || PLACEHOLDER_IMAGES[category] ? (
                <Image
                  alt={title}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  src={imageSrc}
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primaryLight}, ${COLORS.primary}, ${COLORS.accent})`,
                  }}
                >
                  <span className="text-6xl opacity-60">✨</span>
                </div>
              )}
            </div>
            <p className="absolute top-0 left-0 rounded-none border-0 bg-white px-2 py-0.5 font-medium text-[10px] uppercase tracking-wider text-black backdrop-blur-sm sm:-top-0.5 sm:-left-0.5 sm:px-3 sm:py-1 sm:text-xs dark:bg-gray-950/90 dark:text-gray-200">
              #{category}
            </p>
          </div>
          <div className="px-3 pb-3 sm:px-4 sm:pb-4">
            <h3 className="mb-2 font-normal text-base tracking-tight text-gray-900 sm:mb-2 sm:text-lg md:text-2xl dark:text-gray-100">
              {title}
            </h3>
            <p className="mb-4 text-xs leading-relaxed text-gray-600 sm:mb-6 sm:text-sm dark:text-gray-400">
              {description}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="group/link relative flex items-center overflow-hidden text-xs font-medium text-gray-900 transition-colors hover:text-gray-700 sm:text-sm dark:text-gray-100 dark:hover:text-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                <span className="mr-2 overflow-hidden rounded-none border border-gray-200 p-2 transition-colors duration-300 ease-in group-hover/link:bg-black group-hover/link:text-white sm:p-3 dark:border-gray-800 dark:group-hover/link:bg-white dark:group-hover/link:text-black">
                  <ArrowRightIcon className="h-3 w-3 translate-x-0 opacity-100 transition-all duration-500 ease-in group-hover/link:translate-x-8 group-hover/link:opacity-0 sm:h-4 sm:w-4" />
                  <ArrowRightIcon className="absolute -left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-all duration-500 ease-in-out group-hover/link:left-2 sm:-left-5 sm:h-4 sm:w-4 sm:group-hover/link:left-3" />
                </span>
                자세히 보기
              </button>
              <span className="flex items-center gap-2 text-[10px] text-gray-500 sm:gap-3 sm:text-xs dark:text-gray-500">
                {author} · {date}
                <span className="w-6 border-t border-gray-300 sm:w-16 dark:border-gray-700" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
