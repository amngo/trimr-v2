/**
 * Hero section component with animated elements and link creation form
 */

'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LinkForm } from '@/components';
import {
  StaggerContainer,
  SlideUp,
} from '@/components/common/animated-container';
import { Aurora } from '@/components';
import { Navigation } from './navigation';
import { HeroBadge } from './hero-badge';
import { HeroHeading } from './hero-heading';
import { HeroStats } from './hero-stats';

const statItems = [
  { value: '1M+', label: 'Links Created' },
  { value: '50K+', label: 'Active Users' },
  { value: '99.9%', label: 'Uptime' },
] as const;

/**
 * Main hero section component
 */
export function HeroSection() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <Aurora
          colorStops={['#0ea5e9', '#3b82f6', '#8b5cf6']}
          blend={0.5}
          amplitude={0.5}
          speed={0.5}
        />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <Navigation />

        {/* Hero Content */}
        <div className="container mx-auto px-6 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <StaggerContainer className="space-y-8">
              <SlideUp delay={0.4} className="space-y-6">
                <HeroBadge>✨ Transform Long URLs Instantly</HeroBadge>

                <HeroHeading
                  title="Shorten URLs"
                  subtitle="Beautifully"
                  description="Transform your long URLs into elegant, shareable links with our powerful URL shortener. Track clicks, manage links, and gain insights with our beautiful dashboard."
                />
              </SlideUp>

              <SlideUp delay={0.6}>
                <Link href="/register">
                  <Button
                    size="2xl"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </SlideUp>

              {/* Stats */}
              <HeroStats stats={statItems} />
            </StaggerContainer>

            {/* Right Column - Link Form */}
            <SlideUp delay={0.6}>
              <LinkForm />
            </SlideUp>
          </div>
        </div>
      </div>
    </div>
  );
}

