'use client';

/**
 * Hero heading component with gradient text
 */
interface HeroHeadingProps {
  title: string;
  subtitle: string;
  description: string;
}

export function HeroHeading({ title, subtitle, description }: HeroHeadingProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
        {title}
        <br />
        <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          {subtitle}
        </span>
      </h1>

      <p className="text-xl leading-relaxed max-w-lg">
        {description}
      </p>
    </div>
  );
}