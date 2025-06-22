// Authentication domain types

// Login Request
export interface LoginRequest {
  email: string;
  password: string;
}

// Login Response
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    userId: number;
    email: string;
    nickname: string;
  };
}

// Token Refresh Request
export interface TokenRefreshRequest {
  refreshToken: string;
}

// Auth State
export interface AuthState {
  isAuthenticated: boolean;
  user: {
    userId: number;
    email: string;
    nickname: string;
  } | null;
  accessToken: string | null;
  refreshToken: string | null;
} 