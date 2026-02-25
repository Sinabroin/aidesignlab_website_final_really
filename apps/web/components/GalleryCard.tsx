"use client";

/** 갤러리 카드 — 썸네일 없을 시 포스터 embed를 iframe으로 표시 */
import { useState, useEffect } from "react";
import Image from "next/image";
import { GlowingEffect } from "@/components/common/GlowingEffect";
import { extractPosterEmbed, type PosterEmbedData } from "@/lib/utils/poster-embed";
import PosterPreviewFrame from "@/components/editor/PosterEmbed/PosterPreviewFrame";

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
  workshop: "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h1.jpg",
  data: "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h2.jpg",
  usecase: "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h4.jpg",
  trend: "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h2.jpg",
  prompt: "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h1.jpg",
  hai: "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h4.jpg",
  teams: "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h2.jpg",
  safety: "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h1.jpg",
  planning: "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h4.jpg",
  "ai system": "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h4.jpg",
  design: "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h1.jpg",
  seminar: "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h2.jpg",
  contest: "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h4.jpg",
  networking: "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h2.jpg",
  interview: "https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h1.jpg",
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

function getPlaceholderImage(category: string): string {
  const key = category.toLowerCase();
  return PLACEHOLDER_IMAGES[key] ?? PLACEHOLDER_IMAGES.workshop;
}

interface CardImageAreaProps {
  title: string;
  category: string;
  description: string;
  thumbnail?: string;
  imageUrl?: string;
}

function CardImageArea({ title, category, description, thumbnail, imageUrl }: CardImageAreaProps) {
  const [posterEmbed, setPosterEmbed] = useState<PosterEmbedData | null>(null);

  useEffect(() => {
    const t0 = Date.now();
    if (!thumbnail && !imageUrl) {
      const result = extractPosterEmbed(description);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'GalleryCard.tsx:CardImageArea',message:'poster extract',data:{hasPoster:!!result,parseMs:Date.now()-t0,title},hypothesisId:'H-C/H-D',timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      setPosterEmbed(result);
    } else {
      setPosterEmbed(null);
    }
  }, [description, thumbnail, imageUrl]);

  const categoryBadge = (
    <span className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-[#111] rounded-none">
      #{category}
    </span>
  );

  if (posterEmbed) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {categoryBadge}
        <PosterPreviewFrame html={posterEmbed.html} css={posterEmbed.css} clickThrough />
      </div>
    );
  }

  const imageSrc = thumbnail || imageUrl || getPlaceholderImage(category);
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden">
      <Image
        alt={title}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        src={imageSrc}
      />
      {categoryBadge}
    </div>
  );
}

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
  const handleClick = () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'GalleryCard.tsx:handleClick',message:'card click fired',data:{title,hasOnClick:!!onClick},hypothesisId:'H-A',timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    if (onClick) onClick();
    else if (readMoreLink && readMoreLink !== "#") window.location.href = readMoreLink;
  };

  return (
    <div className="group relative cursor-pointer rounded-none" onClick={handleClick}>
      <GlowingEffect disabled={false} spread={24} movementDuration={1.5} inactiveZone={0.2} borderWidth={4} proximity={20} />
      <div className="relative bg-white border border-[#D9D6D3] rounded-none overflow-hidden transition-all duration-200 hover:border-[#6B6B6B] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        <CardImageArea title={title} category={category} description={description} thumbnail={thumbnail} imageUrl={imageUrl} />
        <div className="p-5">
          <h3 className="text-base font-normal text-[#111] mb-1.5 line-clamp-1">{title}</h3>
          <p className="text-sm text-[#6B6B6B] mb-4 line-clamp-2 leading-relaxed">{stripHtml(description)}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6B6B6B]">{author} · {date}</span>
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
