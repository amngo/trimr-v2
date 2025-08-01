'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Link2, Zap, Shield, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LinkForm } from '@/components/link-form';
import { LinkCreationSheet } from '@/components/link-creation-sheet';
import Aurora from './background/aurora';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
};

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

export function HeroSection({ onLinkCreated }: { onLinkCreated?: () => void }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background elements */}
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
        <motion.nav
          className="flex items-center justify-between px-6 py-4 mx-12 mt-8 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">trimr</span>
          </motion.div>

          <motion.div
            className="hidden md:flex items-center space-x-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.a
              href="#features"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              Features
            </motion.a>
            <Link href="/dashboard">
              <motion.span
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors cursor-pointer"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                Dashboard
              </motion.span>
            </Link>
            <motion.a
              href="#pricing"
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              Pricing
            </motion.a>
          </motion.div>
        </motion.nav>

        {/* Hero Content */}
        <motion.div
          className="container mx-auto px-6 md:px-8 py-20 md:py-32"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <motion.div variants={itemVariants} className="space-y-6">
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
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4"
              >
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
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200 dark:border-slate-700"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    1M+
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Links Created
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    50K+
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Active Users
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    99.9%
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Uptime
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Link Form */}
            <motion.div variants={itemVariants} className="lg:pl-8">
              <motion.div
                className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <LinkForm onSuccess={onLinkCreated} />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
