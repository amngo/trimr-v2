'use client';

import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

/**
 * Feature card component for displaying individual features
 */
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

export function FeatureCard({ icon: Icon, title, description, gradient }: FeatureCardProps) {
  return (
    <div className="group">
      <motion.div
        className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 h-full"
        whileHover={{
          scale: 1.02,
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Icon */}
        <motion.div
          className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${gradient} mb-6 shadow-lg`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <Icon className="w-7 h-7 text-white" />
        </motion.div>

        {/* Content */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="text-slate-300 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Hover effect overlay */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 bg-gradient-to-br from-blue-500 to-purple-600 transition-opacity duration-300"
          initial={false}
        />
      </motion.div>
    </div>
  );
}