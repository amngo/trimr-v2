const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface Link {
  id: string;
  name?: string;
  slug: string;
  original: string;
  clicks: number;
  createdAt: string;
  lastUpdated: string;
  expiresAt?: string;
  activeFrom?: string;
  shortUrl: string;
  uniqueClicks: number;
  isActive: boolean;
  isExpired: boolean;
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

export interface User {
  id: string;
  email: string;
  createdAt: string;
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

// Token management
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
}

export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
}

function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Authentication functions
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to register');
  }

  const authResponse = await response.json();
  setToken(authResponse.token);
  return authResponse;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to login');
  }

  const authResponse = await response.json();
  setToken(authResponse.token);
  return authResponse;
}

export async function logout(): Promise<void> {
  removeToken();
}

export async function getProfile(): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  return response.json();
}

// Link functions
export async function createLink(data: CreateLinkRequest): Promise<CreateLinkResponse> {
  const response = await fetch(`${API_BASE_URL}/links`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create link');
  }

  return response.json();
}

export async function getLinks(): Promise<Link[]> {
  const response = await fetch(`${API_BASE_URL}/links`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch links');
  }

  return response.json();
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

export async function checkLinkAccess(slug: string, password?: string): Promise<AccessLinkResponse> {
  const response = await fetch(`${API_BASE_URL}/links/${slug}/access`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to check link access');
  }

  return response.json();
}