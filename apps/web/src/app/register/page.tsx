'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Link2,
  Mail,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  UserPlus,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
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

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      await register(name, email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
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
          <Link href="/">
            <motion.button
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Register Card */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent>
              {/* Header */}
              <motion.div
                variants={itemVariants}
                className="text-center space-y-4 mb-8"
              >
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Link2 className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    Create Account
                  </h1>
                  <p className="text-slate-600 dark:text-slate-300 mt-2">
                    Join us and start shortening your URLs
                  </p>
                </div>
              </motion.div>

              {/* Register Form */}
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={loading}
                      className="pl-10 h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="pl-10 h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="pl-10 pr-10 h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="pl-10 pr-10 h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </motion.div>

                {/* Password Requirements */}
                <motion.div
                  variants={itemVariants}
                  className="text-xs text-slate-500 dark:text-slate-400 space-y-1"
                >
                  <p>Password requirements:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li
                      className={
                        password.length >= 8
                          ? 'text-green-600 dark:text-green-400'
                          : ''
                      }
                    >
                      At least 8 characters
                    </li>
                    <li
                      className={
                        /[A-Z]/.test(password)
                          ? 'text-green-600 dark:text-green-400'
                          : ''
                      }
                    >
                      One uppercase letter
                    </li>
                    <li
                      className={
                        /[0-9]/.test(password)
                          ? 'text-green-600 dark:text-green-400'
                          : ''
                      }
                    >
                      One number
                    </li>
                  </ul>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <motion.div variants={itemVariants}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-medium rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      {loading ? (
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
                          <span>Creating account...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <UserPlus className="w-5 h-5" />
                          <span>Create Account</span>
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.form>

              {/* Footer */}
              <motion.div
                variants={itemVariants}
                className="mt-8 text-center space-y-4"
              >
                <div className="flex items-center justify-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
                  <span>Already have an account?</span>
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Sign in
                  </Link>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    By creating an account, you agree to our{' '}
                    <Link
                      href="/terms"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="/privacy"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div variants={itemVariants} className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Secure Registration</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Encrypted Data</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Privacy Protected</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
