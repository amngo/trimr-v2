'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { createLink } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Link2, Copy, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

interface LinkCreationSheetProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function LinkCreationSheet({
  children,
  onSuccess,
}: LinkCreationSheetProps) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShortUrl(null);
    setCopied(false);

    try {
      const response = await createLink({
        url,
        name: name || undefined,
      });

      setShortUrl(response.shortUrl);
      setUrl('');
      setName('');

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (shortUrl) {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset form state when closing
    setTimeout(() => {
      setUrl('');
      setName('');
      setError(null);
      setShortUrl(null);
      setCopied(false);
    }, 300);
  };

  const handleCreateAnother = () => {
    setShortUrl(null);
    setError(null);
    setCopied(false);
    setUrl('');
    setName('');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="space-y-4">
          <div className="flex items-center space-x-3">
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Link2 className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <SheetTitle className="text-xl font-bold">
                Create Short Link
              </SheetTitle>
              <SheetDescription>
                Transform your long URL into a beautiful, shareable link
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 p-4">
          {!shortUrl ? (
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="sheet-url"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Your URL *
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      id="sheet-url"
                      type="url"
                      placeholder="https://your-very-long-url.com/with/lots/of/parameters"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                      disabled={loading}
                      className="h-12 px-4 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="sheet-name"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Custom Name (optional)
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      id="sheet-name"
                      type="text"
                      placeholder="Give your link a memorable name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      className="h-12 px-4 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </motion.div>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </motion.div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 h-12"
                >
                  Cancel
                </Button>
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <span>Creating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Create Link</span>
                      </div>
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Success State */}
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg"
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Link Created Successfully!
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Your short URL is ready to share
                  </p>
                </div>
              </div>

              {/* Generated Link */}
              <div className="space-y-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Your Short URL:
                </p>
                <div className="flex items-center space-x-3 p-3 bg-white dark:bg-slate-800 rounded-lg border">
                  <code className="flex-1 font-mono text-sm text-slate-900 dark:text-slate-100 truncate">
                    {shortUrl}
                  </code>
                  <motion.button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCreateAnother}
                  className="flex-1 h-12"
                >
                  Create Another
                </Button>
                <Button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Done
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
