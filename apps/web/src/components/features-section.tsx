"use client";

import { motion } from "motion/react";
import { Link2, BarChart3, Shield, Zap, Eye, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkCreationSheet } from "@/components/link-creation-sheet";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const
    }
  }
};

const features = [
  {
    icon: Link2,
    title: "Instant URL Shortening",
    description: "Transform long URLs into clean, shareable links in milliseconds with our lightning-fast processing engine.",
    gradient: "from-blue-500 to-blue-600"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track clicks, analyze traffic patterns, and gain deep insights into your link performance with beautiful visualizations.",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Your data stays secure with enterprise-grade encryption, privacy controls, and compliance standards.",
    gradient: "from-emerald-500 to-emerald-600"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built for speed with sub-100ms response times and global CDN distribution for instant redirects worldwide.",
    gradient: "from-amber-500 to-amber-600"
  },
  {
    icon: Eye,
    title: "Click Tracking",
    description: "Monitor every click with detailed timestamps, geographic data, and device information for comprehensive insights.",
    gradient: "from-rose-500 to-rose-600"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share links across your team, set permissions, and collaborate on link management with role-based access.",
    gradient: "from-indigo-500 to-indigo-600"
  }
];

export function FeaturesSection({ onLinkCreated }: { onLinkCreated?: () => void }) {
  return (
    <section id="features" className="py-20 md:py-32 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6 md:px-8">
        <motion.div
          className="text-center space-y-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Everything you need to manage, track, and optimize your links.
            Built with modern technology and designed for developers, marketers, and teams.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <motion.div
                className="relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 h-full"
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Icon */}
                <motion.div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6 shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </motion.div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 bg-gradient-to-br from-blue-500 to-purple-600 transition-opacity duration-300"
                  initial={false}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action */}
        <motion.div
          className="text-center mt-16 space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <LinkCreationSheet onSuccess={onLinkCreated}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
                >
                  Try It Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </LinkCreationSheet>
            
            <motion.a
              href="#dashboard"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
              whileHover={{ scale: 1.05 }}
            >
              <span>See all features in action</span>
              <motion.div
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.div>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
