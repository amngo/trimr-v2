'use client';

/**
 * Hero badge component with customizable text
 */
interface HeroBadgeProps {
  children: React.ReactNode;
}

export function HeroBadge({ children }: HeroBadgeProps) {
  return (
    <div className="inline-block px-4 py-2 glass border rounded-full">
      <span className="text-sm font-medium">{children}</span>
    </div>
  );
}