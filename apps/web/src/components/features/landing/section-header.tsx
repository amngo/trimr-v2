'use client';

import { motion } from 'motion/react';

/**
 * Reusable section header component
 */
interface SectionHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export function SectionHeader({ title, description, className = '' }: SectionHeaderProps) {
  return (
    <motion.div
      className={`text-center space-y-6 ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-4xl md:text-5xl font-bold">
        <span className="bg-gradient-to-r from-slate-100 via-blue-200 to-purple-200 bg-clip-text text-transparent">
          {title}
        </span>
      </h2>
      <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}