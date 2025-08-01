import { 
  Link, 
  CreateLinkRequest, 
  CreateLinkResponse, 
  UpdateLinkRequest,
  User, 
  RegisterRequest, 
  LoginRequest, 
  AuthResponse,
  AccessLinkRequest,
  AccessLinkResponse,
  AppError
} from '@/types'
import { API_CONFIG, AUTH_CONFIG, ROUTES } from '@/lib/constants'
import { handleApiError, safeLocalStorage, delay, setCookie, removeCookie } from '@/lib/utils'

/**
 * Enhanced API client with better error handling, retries, and type safety
 */
class ApiClient {
  private baseUrl: string
  private timeout: number
  private retryAttempts: number
  private retryDelay: number

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL
    this.timeout = API_CONFIG.TIMEOUT
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS
    this.retryDelay = API_CONFIG.RETRY_DELAY
  }

  /**
   * Get authentication token from storage
   */
  private getToken(): string | null {
    return safeLocalStorage().getItem(AUTH_CONFIG.TOKEN_KEY)
  }

  /**
   * Set authentication token in storage and cookie
   */
  private setToken(token: string): void {
    safeLocalStorage().setItem(AUTH_CONFIG.TOKEN_KEY, token)
    
    // Also set as HTTP cookie for middleware access
    setCookie(AUTH_CONFIG.TOKEN_KEY, token, {
      maxAge: AUTH_CONFIG.SESSION_TIMEOUT / 1000, // Convert to seconds
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
  }

  /**
   * Remove authentication token from storage and cookie
   */
  private removeToken(): void {
    safeLocalStorage().removeItem(AUTH_CONFIG.TOKEN_KEY)
    
    // Also remove HTTP cookie
    removeCookie(AUTH_CONFIG.TOKEN_KEY)
  }

  /**
   * Get headers for API requests
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    const token = this.getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  }

  /**
   * Make HTTP request with retry logic and error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    }

    let lastError: Error | null = null

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), this.timeout)

        const response = await fetch(url, {
          ...config,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new AppError(
            errorData.error || `HTTP ${response.status}`,
            'HTTP_ERROR',
            response.status,
            { url, attempt }
          )
        }

        // Handle empty responses
        const contentType = response.headers.get('content-type')
        if (contentType?.includes('application/json')) {
          return await response.json()
        }
        
        return {} as T
      } catch (error) {
        lastError = error as Error

        // Don't retry on certain errors
        if (error instanceof AppError && error.statusCode && error.statusCode < 500) {
          throw handleApiError(error)
        }

        if (attempt < this.retryAttempts) {
          await delay(this.retryDelay * attempt) // Exponential backoff
          continue
        }
      }
    }

    throw handleApiError(lastError)
  }

  // Authentication methods
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(ROUTES.API.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(data),
    })

    this.setToken(response.token)
    return response
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(ROUTES.API.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(data),
    })

    this.setToken(response.token)
    return response
  }

  async logout(): Promise<void> {
    try {
      await this.request(ROUTES.API.AUTH.LOGOUT, { method: 'POST' })
    } finally {
      this.removeToken()
    }
  }

  async getProfile(): Promise<User> {
    return this.request<User>(ROUTES.API.AUTH.PROFILE)
  }

  // Link methods
  async createLink(data: CreateLinkRequest): Promise<CreateLinkResponse> {
    return this.request<CreateLinkResponse>(ROUTES.API.LINKS.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getLinks(): Promise<Link[]> {
    return this.request<Link[]>(ROUTES.API.LINKS.LIST)
  }

  async getLink(id: string): Promise<Link> {
    return this.request<Link>(ROUTES.API.LINKS.GET(id))
  }

  async updateLink(id: string, data: UpdateLinkRequest): Promise<{ message: string }> {
    return this.request<{ message: string }>(ROUTES.API.LINKS.UPDATE(id), {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteLink(id: string): Promise<void> {
    return this.request<void>(ROUTES.API.LINKS.DELETE(id), {
      method: 'DELETE',
    })
  }

  async checkLinkAccess(slug: string, password?: string): Promise<AccessLinkResponse> {
    return this.request<AccessLinkResponse>(ROUTES.API.LINKS.ACCESS(slug), {
      method: 'POST',
      body: JSON.stringify({ password }),
    })
  }
}

// Create singleton instance
const apiClient = new ApiClient()

// Export individual methods for backward compatibility
export const getToken = () => apiClient['getToken']()
export const setToken = (token: string) => apiClient['setToken'](token)
export const removeToken = () => apiClient['removeToken']()

export const register = (data: RegisterRequest) => apiClient.register(data)
export const login = (data: LoginRequest) => apiClient.login(data)
export const logout = () => apiClient.logout()
export const getProfile = () => apiClient.getProfile()

export const createLink = (data: CreateLinkRequest) => apiClient.createLink(data)
export const getLinks = () => apiClient.getLinks()
export const getLink = (id: string) => apiClient.getLink(id)
export const updateLink = (id: string, data: UpdateLinkRequest) => apiClient.updateLink(id, data)
export const deleteLink = (id: string) => apiClient.deleteLink(id)
export const checkLinkAccess = (slug: string, password?: string) => apiClient.checkLinkAccess(slug, password)

// Export types for use in other components
export type {
  Link,
  CreateLinkRequest,
  CreateLinkResponse,
  UpdateLinkRequest,
  User,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  AccessLinkRequest,
  AccessLinkResponse,
  AppError
}

// Export the client instance for advanced usage
export default apiClient