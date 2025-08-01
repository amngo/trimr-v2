/**
 * Reusable loading spinner component with variants
 */

'use client'

import { motion } from 'framer-motion'
import { BaseComponentProps } from '@/types'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps extends BaseComponentProps {
  /**
   * Size of the spinner
   */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /**
   * Color variant of the spinner
   */
  variant?: 'primary' | 'secondary' | 'white' | 'current'
  /**
   * Loading message to display
   */
  message?: string
  /**
   * Whether to center the spinner
   */
  centered?: boolean
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
}

const colorClasses = {
  primary: 'border-blue-500',
  secondary: 'border-purple-500',
  white: 'border-white',
  current: 'border-current',
}

/**
 * LoadingSpinner component for consistent loading states
 */
export function LoadingSpinner({
  size = 'md',
  variant = 'primary',
  message,
  centered = false,
  className,
  children,
  ...props
}: LoadingSpinnerProps) {
  const spinnerElement = (
    <motion.div
      className={cn(
        'border-2 border-t-transparent rounded-full',
        sizeClasses[size],
        colorClasses[variant],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      {...props}
    />
  )

  if (message || children) {
    return (
      <div className={cn('flex items-center space-x-3', centered && 'justify-center')}>
        {spinnerElement}
        {message && (
          <span className="text-sm text-slate-600 dark:text-slate-300">{message}</span>
        )}
        {children}
      </div>
    )
  }

  if (centered) {
    return (
      <div className="flex justify-center items-center">
        {spinnerElement}
      </div>
    )
  }

  return spinnerElement
}

/**
 * Full screen loading overlay
 */
export function LoadingOverlay({
  message = 'Loading...',
  className,
}: {
  message?: string
  className?: string
}) {
  return (
    <motion.div
      className={cn(
        'fixed inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center',
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center space-y-4">
        <LoadingSpinner size="xl" />
        <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
          {message}
        </p>
      </div>
    </motion.div>
  )
}

/**
 * Loading state for buttons
 */
export function ButtonSpinner({ className }: { className?: string }) {
  return (
    <LoadingSpinner
      size="sm"
      variant="current"
      className={cn('mr-2', className)}
    />
  )
}

/**
 * Skeleton loading placeholder
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-200 dark:bg-slate-700',
        className
      )}
      {...props}
    />
  )
}

/**
 * Text skeleton with realistic proportions
 */
export function TextSkeleton({
  lines = 1,
  className,
}: {
  lines?: number
  className?: string
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}