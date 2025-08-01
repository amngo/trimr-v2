/**
 * Hero section component with animated elements and link creation form
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Link2, Zap, Shield, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LinkForm, LinkCreationSheet } from '@/components';
import {
  StaggerContainer,
  SlideUp,
  FadeIn,
} from '@/components/common/animated-container';
import { Aurora } from '@/components';
import { BaseComponentProps } from '@/types';

interface HeroSectionProps extends BaseComponentProps {
  onLinkCreated?: () => void;
}

const statItems = [
  { value: '1M+', label: 'Links Created' },
  { value: '50K+', label: 'Active Users' },
  { value: '99.9%', label: 'Uptime' },
] as const;

const floatingIcons = [
  {
    icon: Zap,
    position: 'top-1/4 right-1/4',
    size: 'w-16 h-16',
    gradient: 'from-blue-500 to-purple-600',
    delay: 0,
  },
  {
    icon: Shield,
    position: 'bottom-1/3 left-1/4',
    size: 'w-12 h-12',
    gradient: 'from-green-500 to-blue-500',
    delay: 1,
  },
  {
    icon: BarChart3,
    position: 'top-1/2 left-1/6',
    size: 'w-14 h-14',
    gradient: 'from-purple-500 to-pink-500',
    delay: 2,
  },
] as const;

/**
 * Main hero section component
 */
export function HeroSection({ onLinkCreated, className }: HeroSectionProps) {
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
          <nav className="flex items-center justify-between px-6 py-4 mx-12 mt-8 glass rounded-lg border">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Link2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">trimr</span>
            </motion.div>

            <StaggerContainer className="hidden md:flex items-center space-x-8">
              <NavigationLink href="#features">Features</NavigationLink>
              <Link href="/dashboard">
                <NavigationLink as="span">Dashboard</NavigationLink>
              </Link>
              <NavigationLink href="#pricing">Pricing</NavigationLink>
            </StaggerContainer>
          </nav>
        </FadeIn>

        {/* Hero Content */}
        <div className="container mx-auto px-6 md:px-8 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column - Text Content */}
            <StaggerContainer className="space-y-8">
              <SlideUp delay={0.4} className="space-y-6">
                <motion.div
                  className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                    ✨ Transform Long URLs Instantly
                  </span>
                </motion.div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                    Shorten URLs
                  </span>
                  <br />
                  <span className="text-slate-600 dark:text-slate-300">
                    Beautifully
                  </span>
                </h1>

                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                  Transform your long URLs into elegant, shareable links with
                  our powerful URL shortener. Track clicks, manage links, and
                  gain insights with our beautiful dashboard.
                </p>
              </SlideUp>

              <SlideUp delay={0.6} className="flex flex-col sm:flex-row gap-4">
                <LinkCreationSheet onSuccess={onLinkCreated}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                </LinkCreationSheet>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg"
                  >
                    View Demo
                  </Button>
                </motion.div>
              </SlideUp>

              {/* Stats */}
              <SlideUp
                delay={0.8}
                className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200 dark:border-slate-700"
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
            <SlideUp delay={0.6} className="lg:pl-8">
              <motion.div
                className="glass border rounded-3xl p-8"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <LinkForm onSuccess={onLinkCreated} />
              </motion.div>
            </SlideUp>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Navigation link component with hover effects
 */
function NavigationLink({
  href,
  children,
  as = 'a',
}: {
  href?: string;
  children: React.ReactNode;
  as?: 'a' | 'span';
}) {
  const Component = as === 'span' ? motion.span : motion.a;

  return (
    <Component
      href={href}
      className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors cursor-pointer"
      whileHover={{ scale: 1.05 }}
    >
      {children}
    </Component>
  );
}

/**
 * Statistics item component
 */
function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        {value}
      </div>
      <div className="text-sm text-slate-600 dark:text-slate-400">{label}</div>
    </div>
  );
}
