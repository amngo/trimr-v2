'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';

export function AuthForm() {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-sm bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-lg">Get Started</CardTitle>
          <CardDescription>Sign in or create an account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/login">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </motion.div>
          </Link>

          <Link href="/register">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className="w-full h-12 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </Button>
            </motion.div>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
