/**
 * Core types and interfaces for the URL Shortener application
 */

// API Response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Link-related types
export interface Link {
  id: string;
  name?: string;
  slug: string;
  original: string;
  clicks: number;
  uniqueClicks: number;
  createdAt: string;
  lastUpdated: string;
  expiresAt?: string;
  activeFrom?: string;
  shortUrl: string;
  isActive: boolean;
  isExpired: boolean;
  userId?: string;
  faviconUrl?: string;
}

export interface CreateLinkRequest {
  url: string;
  name?: string;
  expiresAt?: string;
  activeFrom?: string;
  password?: string;
}

export interface CreateLinkResponse {
  shortUrl: string;
  slug: string;
}

export interface UpdateLinkRequest {
  name?: string;
  expiresAt?: string;
  activeFrom?: string;
  password?: string;
}

export interface AccessLinkRequest {
  password?: string;
}

export interface AccessLinkResponse {
  slug: string;
  passwordRequired: boolean;
  passwordValid?: boolean;
  originalUrl?: string;
}

// User and Authentication types
export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Analytics types
export interface ClickEvent {
  id: string;
  linkId: string;
  timestamp: string;
  ip?: string;
  country?: string;
  device?: string;
  userAgent?: string;
  referrer?: string;
}

export interface LinkAnalytics {
  linkId: string;
  totalClicks: number;
  uniqueClicks: number;
  clicksByDate: Record<string, number>;
  clicksByCountry: Record<string, number>;
  clicksByDevice: Record<string, number>;
  clicksByReferrer: Record<string, number>;
}

// Form and UI types
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isDirty: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

// Animation and motion types
export interface AnimationVariants {
  hidden: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
  };
  visible: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
    transition?: {
      duration?: number;
      delay?: number;
      ease?: string;
      delayChildren?: number;
      staggerChildren?: number;
    };
  };
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LinkFormProps extends BaseComponentProps {
  onSuccess?: (link: Link) => void;
  onError?: (error: string) => void;
  initialData?: Partial<CreateLinkRequest>;
}

export interface DashboardProps extends BaseComponentProps {
  refresh?: number;
  onLinkUpdate?: (link: Link) => void;
  onLinkDelete?: (linkId: string) => void;
}

// Store and state types
export interface LinkStore {
  links: Link[];
  isLoading: boolean;
  error: string | null;
  selectedLink: Link | null;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UIStore {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  toasts: ToastMessage[];
  modals: {
    isLinkCreationOpen: boolean;
    isLinkEditOpen: boolean;
    isDeleteConfirmOpen: boolean;
  };
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Environment and configuration types
export interface AppConfig {
  apiBaseUrl: string;
  environment: 'development' | 'production' | 'test';
  features: {
    authentication: boolean;
    analytics: boolean;
    passwordProtection: boolean;
    expiryDates: boolean;
    scheduledActivation: boolean;
  };
}

// Error types
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public field?: string,
    context?: Record<string, unknown>
  ) {
    super(message, 'VALIDATION_ERROR', 400, context);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends AppError {
  constructor(
    message: string,
    public statusCode: number,
    context?: Record<string, unknown>
  ) {
    super(message, 'NETWORK_ERROR', statusCode, context);
    this.name = 'NetworkError';
  }
}