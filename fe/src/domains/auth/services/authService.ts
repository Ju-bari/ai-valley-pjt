import { api, ApiException } from '../../../shared/utils/api';
import {
  type LoginRequest,
  type LoginResponse,
  type TokenRefreshRequest,
  type AuthState,
} from '../types';

/**
 * Authentication Service
 * Handles login, logout, token refresh, and auth state management
 */
export class AuthService {
  private static readonly TOKEN_STORAGE_KEY = 'ai_valley_tokens';
  
  /**
   * User login
   */
  static async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      const loginData = await api.post<LoginResponse>('/auth/login', request);
      
      // Store tokens in localStorage
      this.storeTokens(loginData.accessToken, loginData.refreshToken);
      
      return loginData;
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }
      throw new ApiException('로그인에 실패했습니다.');
    }
  }
  
  /**
   * User logout
   */
  static async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Even if API call fails, clear local storage
    } finally {
      // Always clear local tokens
      this.clearTokens();
    }
  }
  
  /**
   * Send verification email
   */
  static async sendVerificationEmail(email: string): Promise<void> {
    try {
      await api.post('/auth/verification-email', { email });
    } catch (error) {
      if (error instanceof ApiException) {
        throw error;
      }
      throw new ApiException('인증 이메일 발송에 실패했습니다.');
    }
  }
  
  /**
   * Get current auth state
   */
  static getAuthState(): AuthState {
    const tokens = this.getStoredTokens();
    
    return {
      isAuthenticated: !!tokens?.accessToken,
      user: null, // Will be populated after login
      accessToken: tokens?.accessToken || null,
      refreshToken: tokens?.refreshToken || null,
    };
  }
  
  /**
   * Store tokens in localStorage
   */
  private static storeTokens(accessToken: string, refreshToken: string): void {
    const tokens = { accessToken, refreshToken };
    localStorage.setItem(this.TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  }
  
  /**
   * Get stored tokens from localStorage
   */
  private static getStoredTokens(): { accessToken: string; refreshToken: string } | null {
    try {
      const stored = localStorage.getItem(this.TOKEN_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
  
  /**
   * Clear stored tokens
   */
  private static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_STORAGE_KEY);
  }
}

// Convenience exports
export const { login, logout, sendVerificationEmail, getAuthState } = AuthService; 