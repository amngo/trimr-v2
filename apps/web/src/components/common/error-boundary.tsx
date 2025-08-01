/**
 * Error boundary component for graceful error handling
 */

'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppError } from '@/types'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  showDetails?: boolean
}

/**
 * ErrorBoundary class component for catching JavaScript errors
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // Call custom error handler
    this.props.onError?.(error, errorInfo)

    // TODO: Send to error reporting service in production
    // reportError(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
          onGoHome={this.handleGoHome}
          showDetails={this.props.showDetails}
        />
      )
    }

    return this.props.children
  }
}

/**
 * Default error fallback component
 */
interface ErrorFallbackProps {
  error: Error | null
  errorInfo: ErrorInfo | null
  onRetry: () => void
  onGoHome: () => void
  showDetails?: boolean
}

function ErrorFallback({
  error,
  errorInfo,
  onRetry,
  onGoHome,
  showDetails = false,
}: ErrorFallbackProps) {
  const isAppError = error instanceof AppError

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-lg w-full text-center space-y-6">
        <motion.div
          className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {isAppError ? 'Something went wrong' : 'Unexpected Error'}
          </h1>
          
          <p className="text-slate-600 dark:text-slate-300">
            {isAppError && error.message
              ? error.message
              : 'An unexpected error occurred. Please try again or return to the home page.'}
          </p>

          {showDetails && error && (
            <details className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-left">
              <summary className="cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Error Details
              </summary>
              <pre className="text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap">
                {error.stack}
              </pre>
              {errorInfo && (
                <pre className="text-xs text-slate-600 dark:text-slate-400 mt-2 whitespace-pre-wrap">
                  {errorInfo.componentStack}
                </pre>
              )}
            </details>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={onRetry}
            className="flex items-center space-x-2"
            variant="default"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>
          
          <Button
            onClick={onGoHome}
            className="flex items-center space-x-2"
            variant="outline"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Hook-based error boundary for functional components
 */
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    // In a real app, you might want to use a global error state
    // or trigger a toast notification
    console.error('Error caught by useErrorHandler:', error, errorInfo)
    
    // For now, just re-throw to be caught by ErrorBoundary
    throw error
  }
}

/**
 * Higher-order component for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WithErrorBoundaryComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  )

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`

  return WithErrorBoundaryComponent
}