'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Calendar,
  Clock,
  Lock,
  Link2,
  Copy,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus,
} from 'lucide-react';
import { useCreateLink, useIsCreating, useError } from '@/stores';
import { useLinkToasts } from '@/stores/utils';

export function LinkForm({ onSuccess }: { onSuccess?: () => void }) {
  // Zustand stores
  const createLink = useCreateLink();
  const isCreating = useIsCreating();
  const error = useError();
  const { showLinkCreated, showLinkError, showLinkCopied } = useLinkToasts();

  // Local form state
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Advanced options
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [password, setPassword] = useState('');
  const [hasPassword, setHasPassword] = useState(false);
  const [expiresAt, setExpiresAt] = useState('');
  const [hasExpiry, setHasExpiry] = useState(false);
  const [activeFrom, setActiveFrom] = useState('');
  const [hasScheduled, setHasScheduled] = useState(false);

  // Current date for date/time inputs
  const now = new Date();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShortUrl(null);
    setCopied(false);

    try {
      // Create link using Zustand store
      const link = await createLink(url, name || undefined);

      if (link) {
        setShortUrl(link.shortUrl);
        showLinkCreated(name);

        // Reset form
        setUrl('');
        setName('');
        setPassword('');
        setExpiresAt('');
        setActiveFrom('');
        setHasPassword(false);
        setHasExpiry(false);
        setHasScheduled(false);
        setShowAdvanced(false);

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create link';
      showLinkError(errorMessage);
    }
  };

  const handleCopy = async () => {
    if (shortUrl) {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      showLinkCopied();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Format datetime for input (client-side only)
  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="text-center space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Link2 className="w-6 h-6 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Create Short Link
        </h3>
        <p className="text-slate-600 dark:text-slate-300">
          Transform your long URL into a beautiful, shareable link
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Basic Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="url"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Your URL *
            </Label>
            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Input
                id="url"
                type="url"
                placeholder="https://your-very-long-url.com/with/lots/of/parameters"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                disabled={isCreating}
                className="h-12 px-4 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500"
              />
            </motion.div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Custom Name (optional)
            </Label>
            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Input
                id="name"
                type="text"
                placeholder="Give your link a memorable name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isCreating}
                className="h-12 px-4 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500"
              />
            </motion.div>
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <motion.div
          className="border-t border-slate-200 dark:border-slate-700 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            {showAdvanced ? (
              <Minus className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>Advanced Options</span>
          </button>
        </motion.div>

        {/* Advanced Options */}
        {showAdvanced && (
          <motion.div
            className="space-y-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Password Protection */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Switch
                  id="has-password"
                  checked={hasPassword}
                  onCheckedChange={setHasPassword}
                />
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <Label htmlFor="has-password" className="text-sm font-medium">
                    Password Protection
                  </Label>
                </div>
              </div>
              {hasPassword && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="ml-8"
                >
                  <Input
                    type="password"
                    placeholder="Enter password for link access"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isCreating}
                    className="h-10 bg-white dark:bg-slate-700"
                  />
                </motion.div>
              )}
            </div>

            {/* Scheduled Activation */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Switch
                  id="has-scheduled"
                  checked={hasScheduled}
                  onCheckedChange={setHasScheduled}
                />
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <Label
                    htmlFor="has-scheduled"
                    className="text-sm font-medium"
                  >
                    Scheduled Activation
                  </Label>
                </div>
              </div>
              {hasScheduled && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="ml-8 space-y-2"
                >
                  <Label className="text-xs text-slate-600 dark:text-slate-400">
                    Link becomes active at:
                  </Label>
                  <Input
                    type="datetime-local"
                    value={activeFrom}
                    onChange={(e) => setActiveFrom(e.target.value)}
                    min={formatDateTimeLocal(now)}
                    disabled={isCreating}
                    className="h-10 bg-white dark:bg-slate-700"
                  />
                </motion.div>
              )}
            </div>

            {/* Expiry Date */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Switch
                  id="has-expiry"
                  checked={hasExpiry}
                  onCheckedChange={setHasExpiry}
                />
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <Label htmlFor="has-expiry" className="text-sm font-medium">
                    Expiry Date
                  </Label>
                </div>
              </div>
              {hasExpiry && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="ml-8 space-y-2"
                >
                  <Label className="text-xs text-slate-600 dark:text-slate-400">
                    Link expires at:
                  </Label>
                  <Input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    min={
                      hasScheduled && activeFrom
                        ? activeFrom
                        : formatDateTimeLocal(now)
                    }
                    disabled={isCreating}
                    className="h-10 bg-white dark:bg-slate-700"
                  />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </motion.div>
        )}

        {/* Success Message */}
        {shortUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-xl"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="font-medium text-green-700 dark:text-green-300">
                Your short URL is ready!
              </p>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white dark:bg-slate-800 rounded-lg border">
              <code className="flex-1 font-mono text-sm text-slate-900 dark:text-slate-100 truncate">
                {shortUrl}
              </code>
              <motion.button
                type="button"
                onClick={handleCopy}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-sm">Copy</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-medium rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isCreating}
          >
            {isCreating ? (
              <div className="flex items-center space-x-2">
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <span>Creating your link...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link2 className="w-5 h-5" />
                <span>Shorten URL</span>
              </div>
            )}
          </Button>
        </motion.div>
      </motion.form>
    </div>
  );
}
