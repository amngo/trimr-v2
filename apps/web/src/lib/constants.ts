/**
 * Application constants and configuration
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Authentication
export const AUTH_CONFIG = {
  TOKEN_KEY: 'auth_token',
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
} as const;

// UI Constants
export const UI_CONFIG = {
  TOAST_DURATION: {
    SUCCESS: 3000,
    ERROR: 5000,
    WARNING: 4000,
    INFO: 3000,
  },
  ANIMATION_DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  DEBOUNCE_DELAY: 300,
  THEME_KEY: 'url-shortener-theme',
} as const;

// Form Validation
export const VALIDATION = {
  URL: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 2048,
    PATTERN: /^https?:\/\/.+\..+/,
  },
  NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
  PASSWORD: {
    MIN_LENGTH: 4,
    MAX_LENGTH: 50,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
} as const;

// Link Configuration
export const LINK_CONFIG = {
  SLUG_LENGTH: 6,
  MAX_LINKS_PER_USER: 1000,
  DEFAULT_EXPIRY_DAYS: 30,
  CLICK_TRACKING: {
    UNIQUE_WINDOW_HOURS: 24,
    MAX_EVENTS_PER_LINK: 10000,
  },
} as const;

// Feature Flags
export const FEATURES = {
  AUTHENTICATION: true,
  ANALYTICS: true,
  PASSWORD_PROTECTION: true,
  EXPIRY_DATES: true,
  SCHEDULED_ACTIVATION: true,
  BULK_OPERATIONS: false,
  CUSTOM_DOMAINS: false,
  QR_CODES: false,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: {
    OFFLINE: 'You appear to be offline. Please check your connection.',
    TIMEOUT: 'Request timed out. Please try again.',
    SERVER_ERROR: 'Server error occurred. Please try again later.',
  },
  VALIDATION: {
    REQUIRED: 'This field is required',
    INVALID_URL: 'Please enter a valid URL',
    INVALID_EMAIL: 'Please enter a valid email address',
    PASSWORD_TOO_SHORT: 'Password must be at least 4 characters',
    NAME_TOO_LONG: 'Name must be less than 100 characters',
    URL_TOO_LONG: 'URL must be less than 2048 characters',
  },
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    REGISTRATION_FAILED: 'Registration failed. Please try again.',
  },
  LINK: {
    NOT_FOUND: 'Link not found',
    ACCESS_DENIED: 'Access denied. Password required.',
    EXPIRED: 'This link has expired',
    INACTIVE: 'This link is not yet active',
    CREATION_FAILED: 'Failed to create link. Please try again.',
    UPDATE_FAILED: 'Failed to update link. Please try again.',
    DELETE_FAILED: 'Failed to delete link. Please try again.',
  },
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LINK: {
    CREATED: 'Link created successfully!',
    UPDATED: 'Link updated successfully!',
    DELETED: 'Link deleted successfully!',
    COPIED: 'Link copied to clipboard!',
  },
  AUTH: {
    REGISTERED: 'Account created successfully!',
    LOGGED_IN: 'Welcome back!',
    LOGGED_OUT: 'Logged out successfully',
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Animation Variants
export const ANIMATION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  },
} as const;

// Responsive Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Color Palette
export const COLORS = {
  BRAND: {
    PRIMARY: '#3B82F6', // blue-500
    SECONDARY: '#8B5CF6', // purple-500
    ACCENT: '#10B981', // emerald-500
  },
  STATUS: {
    SUCCESS: '#10B981', // emerald-500
    ERROR: '#EF4444', // red-500
    WARNING: '#F59E0B', // amber-500
    INFO: '#3B82F6', // blue-500
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'url-shortener-auth-token',
  THEME: 'url-shortener-theme',
  USER_PREFERENCES: 'url-shortener-preferences',
  DRAFT_LINK: 'url-shortener-draft-link',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LINK: (slug: string) => `/${slug}`,
  API: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      PROFILE: '/auth/profile',
      LOGOUT: '/auth/logout',
    },
    LINKS: {
      CREATE: '/links',
      LIST: '/links',
      GET: (id: string) => `/links/${id}`,
      UPDATE: (id: string) => `/links/${id}`,
      DELETE: (id: string) => `/links/${id}`,
      ACCESS: (slug: string) => `/links/${slug}/access`,
    },
    DASHBOARD: {
      STATS: '/dashboard/stats',
    },
  },
} as const;