'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StaggerContainer, FadeIn } from '@/components/common/animated-container';
import { useAuth } from '@/contexts/auth-context';

/**
 * Navigation component for the hero section
 */
export function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
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
  );
}