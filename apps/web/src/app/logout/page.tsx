'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { LogOut, ArrowLeft, CheckCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { Card, CardContent } from '@/components';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
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

export default function LogoutPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const { logout, user } = useAuth();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !isLoggedOut) {
      router.push('/login');
    }
  }, [user, router, isLoggedOut]);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
      setIsLoggedOut(true);

      // Redirect after a short delay to show success state
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      setIsLoggingOut(false);
      console.error('Logout failed:', error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back Button */}
        <motion.div variants={itemVariants} className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
            disabled={isLoggingOut}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </motion.div>

        {/* Logout Card */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent>
              {isLoggedOut ? (
                // Success State
                <motion.div
                  className="text-center space-y-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex justify-center">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
                    >
                      <CheckCircle className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>

                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                      Logged Out Successfully
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300">
                      You have been securely logged out of your account.
                    </p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                  >
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Redirecting you to the home page...
                    </p>

                    <Link href="/">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Home className="w-5 h-5 mr-2" />
                        Go to Home
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              ) : (
                // Logout Confirmation
                <motion.div
                  className="text-center space-y-6"
                  variants={containerVariants}
                >
                  <motion.div variants={itemVariants}>
                    <div className="flex justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <LogOut className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                      Sign Out
                    </h1>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">
                      Are you sure you want to sign out of your account?
                    </p>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4"
                  >
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      You&apos;ll need to sign in again to access your dashboard
                      and manage your links.
                    </p>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full h-14 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-lg font-medium rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoggingOut ? (
                          <div className="flex items-center space-x-2">
                            <motion.div
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: 'linear',
                              }}
                            />
                            <span>Signing out...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <LogOut className="w-5 h-5" />
                            <span>Yes, Sign Out</span>
                          </div>
                        )}
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        disabled={isLoggingOut}
                        className="w-full h-12 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        Cancel
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Note */}
        {!isLoggedOut && (
          <motion.div variants={itemVariants} className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Secure Logout</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Session Cleared</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Data Protected</span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
