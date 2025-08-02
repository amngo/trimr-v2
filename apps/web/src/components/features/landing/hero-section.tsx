/**
 * Hero section component with animated elements and link creation form
 */

'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LinkForm } from '@/components';
import {
  StaggerContainer,
  SlideUp,
  FadeIn,
} from '@/components/common/animated-container';
import { Aurora } from '@/components';
import { useAuth } from '@/contexts/auth-context';

const statItems = [
  { value: '1M+', label: 'Links Created' },
  { value: '50K+', label: 'Active Users' },
  { value: '99.9%', label: 'Uptime' },
] as const;

/**
 * Main hero section component
 */
export function HeroSection() {
  const { isAuthenticated } = useAuth();

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
        <FadeIn delay={0.2}>
          <nav className="flex items-center justify-between px-6 py-4 mx-6 mt-8 glass rounded-lg border">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Link2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">trimr</span>
            </motion.div>

            <StaggerContainer className="flex items-center space-x-4">
              {!isAuthenticated && (
                <Link href="/login">
                  <Button variant="outline" className="hidden md:inline-flex">
                    Login
                  </Button>
                </Link>
              )}

              {isAuthenticated && (
                <>
                  <Link href="/dashboard">
                    <Button>Dashboard</Button>
                  </Link>

                  <Link href="/logout">
                    <Button variant="outline">Logout</Button>
                  </Link>
                </>
              )}
            </StaggerContainer>
          </nav>
        </FadeIn>

        {/* Hero Content */}
        <div className="container mx-auto px-6 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <StaggerContainer className="space-y-8">
              <SlideUp delay={0.4} className="space-y-6">
                <div className="inline-block px-4 py-2 glass border rounded-full">
                  <span className="text-sm font-medium">
                    ✨ Transform Long URLs Instantly
                  </span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  Shorten URLs
                  <br />
                  <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Beautifully
                  </span>
                </h1>

                <p className="text-xl leading-relaxed max-w-lg">
                  Transform your long URLs into elegant, shareable links with
                  our powerful URL shortener. Track clicks, manage links, and
                  gain insights with our beautiful dashboard.
                </p>
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
              <SlideUp
                delay={0.8}
                className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-700"
              >
                {statItems.map((stat) => (
                  <StatItem
                    key={stat.label}
                    value={stat.value}
                    label={stat.label}
                  />
                ))}
              </SlideUp>
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
