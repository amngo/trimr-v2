import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { AppError, ValidationError, NetworkError } from "@/types"
import { VALIDATION, ERROR_MESSAGES, HTTP_STATUS } from "@/lib/constants"

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validates a URL string
 */
export function validateUrl(url: string): { isValid: boolean; error?: string } {
  if (!url) {
    return { isValid: false, error: ERROR_MESSAGES.VALIDATION.REQUIRED }
  }

  if (url.length < VALIDATION.URL.MIN_LENGTH) {
    return { isValid: false, error: ERROR_MESSAGES.VALIDATION.INVALID_URL }
  }

  if (url.length > VALIDATION.URL.MAX_LENGTH) {
    return { isValid: false, error: ERROR_MESSAGES.VALIDATION.URL_TOO_LONG }
  }

  if (!VALIDATION.URL.PATTERN.test(url)) {
    return { isValid: false, error: ERROR_MESSAGES.VALIDATION.INVALID_URL }
  }

  return { isValid: true }
}

/**
 * Validates an email address
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email) {
    return { isValid: false, error: ERROR_MESSAGES.VALIDATION.REQUIRED }
  }

  if (!VALIDATION.EMAIL.PATTERN.test(email)) {
    return { isValid: false, error: ERROR_MESSAGES.VALIDATION.INVALID_EMAIL }
  }

  return { isValid: true }
}

/**
 * Validates a password
 */
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password) {
    return { isValid: false, error: ERROR_MESSAGES.VALIDATION.REQUIRED }
  }

  if (password.length < VALIDATION.PASSWORD.MIN_LENGTH) {
    return { isValid: false, error: ERROR_MESSAGES.VALIDATION.PASSWORD_TOO_SHORT }
  }

  if (password.length > VALIDATION.PASSWORD.MAX_LENGTH) {
    return { isValid: false, error: 'Password is too long' }
  }

  return { isValid: true }
}

/**
 * Formats a date to a human-readable string
 */
export function formatDate(date: string | Date, options: Intl.DateTimeFormatOptions = {}): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  }

  return dateObj.toLocaleDateString('en-US', defaultOptions)
}

/**
 * Formats a date to a relative time string (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMs = now.getTime() - dateObj.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
  if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
  
  return formatDate(dateObj, { year: 'numeric', month: 'short', day: 'numeric' })
}

/**
 * Formats a number with commas for better readability
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

/**
 * Truncates text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Copies text to clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    const success = document.execCommand('copy')
    document.body.removeChild(textArea)
    return success
  } catch (err) {
    console.error('Failed to copy text:', err)
    return false
  }
}

/**
 * Debounces a function call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttles a function call
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Creates a delay promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Generates a random ID
 */
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Safely parses JSON with error handling
 */
export function safeJsonParse<T = any>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T
  } catch {
    return fallback
  }
}

/**
 * Checks if we're running in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Safely accesses localStorage
 */
export function safeLocalStorage() {
  if (!isBrowser()) {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    }
  }

  return {
    getItem: (key: string) => {
      try {
        return localStorage.getItem(key)
      } catch {
        return null
      }
    },
    setItem: (key: string, value: string) => {
      try {
        localStorage.setItem(key, value)
      } catch {
        // Silently fail
      }
    },
    removeItem: (key: string) => {
      try {
        localStorage.removeItem(key)
      } catch {
        // Silently fail
      }
    },
  }
}

/**
 * Handles API errors and converts them to appropriate error types
 */
export function handleApiError(error: any): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error?.response?.status) {
    const status = error.response.status
    const message = error.response.data?.error || error.message || 'An error occurred'

    switch (status) {
      case HTTP_STATUS.BAD_REQUEST:
        return new ValidationError(message)
      case HTTP_STATUS.UNAUTHORIZED:
        return new AppError(ERROR_MESSAGES.AUTH.UNAUTHORIZED, 'UNAUTHORIZED', status)
      case HTTP_STATUS.FORBIDDEN:
        return new AppError(ERROR_MESSAGES.AUTH.UNAUTHORIZED, 'FORBIDDEN', status)
      case HTTP_STATUS.NOT_FOUND:
        return new AppError(ERROR_MESSAGES.LINK.NOT_FOUND, 'NOT_FOUND', status)
      case HTTP_STATUS.TOO_MANY_REQUESTS:
        return new AppError('Too many requests. Please try again later.', 'RATE_LIMITED', status)
      default:
        return new NetworkError(message, status)
    }
  }

  if (error?.name === 'NetworkError' || error?.code === 'NETWORK_ERROR') {
    return new NetworkError(ERROR_MESSAGES.NETWORK.OFFLINE, 0)
  }

  return new AppError(error?.message || 'An unexpected error occurred')
}

/**
 * Formats datetime for HTML input elements
 */
export function formatDateTimeLocal(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Checks if a date is in the past
 */
export function isDatePast(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.getTime() < Date.now()
}

/**
 * Checks if a date is in the future
 */
export function isDateFuture(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.getTime() > Date.now()
}

/**
 * Gets the current user's timezone
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * Safely sets a cookie
 */
export function setCookie(name: string, value: string, options: {
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
} = {}): void {
  if (!isBrowser()) return;

  const {
    maxAge = 60 * 60 * 24, // 24 hours
    path = '/',
    secure = true,
    sameSite = 'strict'
  } = options;

  let cookieString = `${name}=${encodeURIComponent(value)}; path=${path}`;
  
  if (maxAge) {
    cookieString += `; max-age=${maxAge}`;
  }
  
  if (options.expires) {
    cookieString += `; expires=${options.expires.toUTCString()}`;
  }
  
  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }
  
  if (secure) {
    cookieString += '; secure';
  }
  
  cookieString += `; samesite=${sameSite}`;
  
  document.cookie = cookieString;
}

/**
 * Safely removes a cookie
 */
export function removeCookie(name: string, path: string = '/'): void {
  if (!isBrowser()) return;
  
  document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
