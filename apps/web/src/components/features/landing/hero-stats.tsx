'use client';

import { SlideUp } from '@/components/common/animated-container';

/**
 * Statistics item component
 */
function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

/**
 * Hero statistics component
 */
interface HeroStatsProps {
  stats: readonly { readonly value: string; readonly label: string }[];
  delay?: number;
}

export function HeroStats({ stats, delay = 0.8 }: HeroStatsProps) {
  return (
    <SlideUp
      delay={delay}
      className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-700"
    >
      {stats.map((stat) => (
        <StatItem
          key={stat.label}
          value={stat.value}
          label={stat.label}
        />
      ))}
    </SlideUp>
  );
}