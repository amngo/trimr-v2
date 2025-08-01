'use client';

import { useState } from 'react';
import { HeroSection, FeaturesSection } from '@/components';

export default function Home() {
  const [, setRefreshCount] = useState(0);

  const handleLinkCreated = () => {
    // Trigger dashboard refresh
    setRefreshCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen">
      <HeroSection onLinkCreated={handleLinkCreated} />
      <FeaturesSection />
    </div>
  );
}
