'use client';

import Marquee from '@/components/Marquee';
import MarqueeCard from '@/components/MarqueeCard';
import {
  playdayData,
  playbookUsecases,
  playbookTrends,
  playbookPrompts,
  playbookHAI,
  playbookTeams,
  activityData,
} from '@/data/mockData';

const topRow = [...playdayData, ...playbookUsecases, ...playbookHAI, ...playbookTeams];
const bottomRow = [...playbookTrends, ...playbookPrompts, ...activityData];

export default function MarqueeShowcase() {
  return (
    <div className="relative space-y-4 py-2">
      {/* Left fade overlay */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
      {/* Right fade overlay */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />

      {/* Top row → scrolls left */}
      <Marquee direction="left" speed={40}>
        {topRow.map((item, i) => (
          <MarqueeCard
            key={`top-${i}`}
            title={item.title}
            category={item.category}
            thumbnail={item.thumbnail}
          />
        ))}
      </Marquee>

      {/* Bottom row → scrolls right */}
      <Marquee direction="right" speed={45}>
        {bottomRow.map((item, i) => (
          <MarqueeCard
            key={`bottom-${i}`}
            title={item.title}
            category={item.category}
            thumbnail={item.thumbnail}
          />
        ))}
      </Marquee>
    </div>
  );
}
