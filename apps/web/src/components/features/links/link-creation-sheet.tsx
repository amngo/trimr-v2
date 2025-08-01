'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { createLink } from '@/lib/api';
import type { CreateLinkRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Link2,
  Copy,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Calendar as CalendarIcon,
  Clock,
  Shield,
  ChevronDown,
  Eye,
  EyeOff,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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

  // Advanced options state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [hasExpiry, setHasExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date>();
  const [expiryTime, setExpiryTime] = useState('23:59');
  const [hasScheduledActivation, setHasScheduledActivation] = useState(false);
  const [activationDate, setActivationDate] = useState<Date>();
  const [activationTime, setActivationTime] = useState('00:00');
  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShortUrl(null);
    setCopied(false);

    try {
      // Prepare the request data
      const requestData: CreateLinkRequest = {
        url,
        name: name || undefined,
      };

      // Add expiry date if enabled
      if (hasExpiry && expiryDate) {
        const [hours, minutes] = expiryTime.split(':');
        const expiryDateTime = new Date(expiryDate);
        expiryDateTime.setHours(
          parseInt(hours, 10),
          parseInt(minutes, 10),
          0,
          0,
        );
        requestData.expiresAt = expiryDateTime.toISOString();
      }

      // Add activation date if enabled
      if (hasScheduledActivation && activationDate) {
        const [hours, minutes] = activationTime.split(':');
        const activationDateTime = new Date(activationDate);
        activationDateTime.setHours(
          parseInt(hours, 10),
          parseInt(minutes, 10),
          0,
          0,
        );
        requestData.activeFrom = activationDateTime.toISOString();
      }

      // Add password if enabled
      if (hasPassword && password.trim()) {
        requestData.password = password.trim();
      }

      const response = await createLink(requestData);

      setShortUrl(response.shortUrl);
      setUrl('');
      setName('');

      // Reset advanced options
      setHasExpiry(false);
      setExpiryDate(undefined);
      setExpiryTime('23:59');
      setHasScheduledActivation(false);
      setActivationDate(undefined);
      setActivationTime('00:00');
      setHasPassword(false);
      setPassword('');
      setShowAdvanced(false);

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

      // Reset advanced options
      setHasExpiry(false);
      setExpiryDate(undefined);
      setExpiryTime('23:59');
      setHasScheduledActivation(false);
      setActivationDate(undefined);
      setActivationTime('00:00');
      setHasPassword(false);
      setPassword('');
      setShowAdvanced(false);
      setShowPassword(false);
    }, 300);
  };

  const handleCreateAnother = () => {
    setShortUrl(null);
    setError(null);
    setCopied(false);
    setUrl('');
    setName('');

    // Reset advanced options
    setHasExpiry(false);
    setExpiryDate(undefined);
    setExpiryTime('23:59');
    setHasScheduledActivation(false);
    setActivationDate(undefined);
    setActivationTime('00:00');
    setHasPassword(false);
    setPassword('');
    setShowAdvanced(false);
    setShowPassword(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md glass">
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

              {/* Advanced Options */}
              <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                <CollapsibleTrigger asChild>
                  <motion.button
                    type="button"
                    className="flex items-center justify-between w-full p-3 text-left bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Advanced Options
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: showAdvanced ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    </motion.div>
                  </motion.button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-6 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    {/* Link Expiry */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Link Expiry
                          </Label>
                        </div>
                        <Switch
                          checked={hasExpiry}
                          onCheckedChange={setHasExpiry}
                          disabled={loading}
                        />
                      </div>

                      {hasExpiry && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-2 gap-3"
                        >
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-600 dark:text-slate-400">
                              Expiry Date
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    'h-10 text-left font-normal',
                                    !expiryDate && 'text-muted-foreground',
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {expiryDate
                                    ? format(expiryDate, 'MMM dd, yyyy')
                                    : 'Pick date'}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={expiryDate}
                                  onSelect={setExpiryDate}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-600 dark:text-slate-400">
                              Expiry Time
                            </Label>
                            <Input
                              type="time"
                              value={expiryTime}
                              onChange={(e) => setExpiryTime(e.target.value)}
                              className="h-10"
                              disabled={loading}
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Scheduled Activation */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="w-4 h-4 text-blue-500" />
                          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Scheduled Activation
                          </Label>
                        </div>
                        <Switch
                          checked={hasScheduledActivation}
                          onCheckedChange={setHasScheduledActivation}
                          disabled={loading}
                        />
                      </div>

                      {hasScheduledActivation && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-2 gap-3"
                        >
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-600 dark:text-slate-400">
                              Activation Date
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    'h-10 text-left font-normal',
                                    !activationDate && 'text-muted-foreground',
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {activationDate
                                    ? format(activationDate, 'MMM dd, yyyy')
                                    : 'Pick date'}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={activationDate}
                                  onSelect={setActivationDate}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-600 dark:text-slate-400">
                              Activation Time
                            </Label>
                            <Input
                              type="time"
                              value={activationTime}
                              onChange={(e) =>
                                setActivationTime(e.target.value)
                              }
                              className="h-10"
                              disabled={loading}
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Password Protection */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-green-500" />
                          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Password Protection
                          </Label>
                        </div>
                        <Switch
                          checked={hasPassword}
                          onCheckedChange={setHasPassword}
                          disabled={loading}
                        />
                      </div>

                      {hasPassword && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-2"
                        >
                          <Label className="text-xs text-slate-600 dark:text-slate-400">
                            Enter Password
                          </Label>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Enter a secure password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="h-10 pr-10"
                              disabled={loading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                              disabled={loading}
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          {password && password.length < 6 && (
                            <p className="text-xs text-orange-600 dark:text-orange-400">
                              Password should be at least 6 characters long
                            </p>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </CollapsibleContent>
              </Collapsible>

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
