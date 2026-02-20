'use client';

import Image from 'next/image';

const PLACEHOLDER_IMAGES: Record<string, string> = {
  Workshop: 'https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h1.jpg',
  Data: 'https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h2.jpg',
  Usecase: 'https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h4.jpg',
  Trend: 'https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h2.jpg',
  Prompt: 'https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h1.jpg',
  HAI: 'https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h4.jpg',
  Teams: 'https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h2.jpg',
  Safety: 'https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h1.jpg',
  Planning: 'https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h4.jpg',
  'AI System': 'https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h4.jpg',
  Design: 'https://res.cloudinary.com/dcxm3ccir/image/upload/v1741613286/h1.jpg',
};

interface MarqueeCardProps {
  title: string;
  category: string;
  thumbnail?: string;
  imageUrl?: string;
}

export default function MarqueeCard({ title, category, thumbnail, imageUrl }: MarqueeCardProps) {
  const imageSrc = thumbnail || imageUrl || PLACEHOLDER_IMAGES[category] || PLACEHOLDER_IMAGES.Workshop;

  return (
    <div className="w-[280px] shrink-0 select-none rounded-none border border-[#D9D6D3] bg-white overflow-hidden">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          alt={title}
          className="object-cover"
          fill
          sizes="280px"
          src={imageSrc}
        />
        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#111] rounded-none">
          #{category}
        </span>
      </div>
      <div className="px-3 py-2.5">
        <h3 className="truncate text-sm font-normal text-[#111]">
          {title}
        </h3>
      </div>
    </div>
  );
}
