'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { checkLinkAccess } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Aurora } from '@/components/effects';

interface PasswordPromptProps {
  slug: string;
  onSuccess: (originalUrl: string) => void;
  onCancel?: () => void;
}

export function PasswordPrompt({
  slug,
  onSuccess,
  onCancel,
}: PasswordPromptProps) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await checkLinkAccess(slug, password);

      if (response.passwordValid && response.originalUrl) {
        onSuccess(response.originalUrl);
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to verify password',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center space-y-4">
            <motion.div
              className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Lock className="w-8 h-8 text-white" />
            </motion.div>

            <div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Password Protected Link
              </CardTitle>
              <CardDescription className="mt-2">
                This link is password protected. Enter the password to continue.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="h-12 px-4 pr-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                >
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </motion.div>
              )}

              <div className="flex space-x-3">
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        />
                        <span>Checking...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4" />
                        <span>Access Link</span>
                      </div>
                    )}
                  </Button>
                </motion.div>

                {onCancel && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onCancel}
                      className="h-12 px-6 rounded-xl"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                )}
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Don&apos;t have the password? Contact the link owner.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
