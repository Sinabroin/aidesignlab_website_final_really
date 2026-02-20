"use client";

import Image from "next/image";
import { GlowingEffect } from "@/components/common/GlowingEffect";

interface GalleryCardProps {
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  thumbnail?: string;
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

export default function GalleryCard({
  title,
  description,
  author,
  date,
  category,
  thumbnail,
  imageUrl,
  readMoreLink = "#",
  onClick,
}: GalleryCardProps) {
  const imageSrc =
    thumbnail || imageUrl || PLACEHOLDER_IMAGES[category] || PLACEHOLDER_IMAGES.Workshop;

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
      {/* GlowingEffect 무지개 테두리 유지 */}
      <GlowingEffect
        disabled={false}
        spread={24}
        movementDuration={1.5}
        inactiveZone={0.2}
        borderWidth={4}
        proximity={20}
      />

      <div className="relative bg-white border border-[#D9D6D3] rounded-none overflow-hidden transition-all duration-200 hover:border-[#6B6B6B] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        {/* 이미지 – hover 시 확대 효과 유지 */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            alt={title}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={imageSrc}
          />
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-[#111] rounded-none">
            #{category}
          </span>
        </div>

        {/* 정보 */}
        <div className="p-5">
          <h3 className="text-base font-normal text-[#111] mb-1.5 line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-[#6B6B6B] mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6B6B6B]">
              {author} · {date}
            </span>
            <span className="text-xs text-[#6B6B6B] flex items-center gap-1 group-hover:text-[#0057FF] transition-colors">
              View
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
