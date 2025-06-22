import { type CommonResponse, type ApiError, CommonStatus, COMMON_STATUS_DESCRIPTIONS, COMMON_CONSTANT } from '../types/api';

// Base API configuration
export const API_BASE_URL = 'http://localhost:8080/api/v1'; // 임시로 직접 백엔드 호출

// Common HTTP methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

// API Error class
export class ApiException extends Error {
  public statusCode?: number;
  public commonStatus?: CommonStatus;
  
  constructor(message: string, statusCode?: number, commonStatus?: CommonStatus) {
    super(message);
    this.name = 'ApiException';
    this.statusCode = statusCode;
    this.commonStatus = commonStatus;
  }
}

// Check if response is successful based on backend logic
export function isSuccessResponse<T>(result: CommonResponse<T>): boolean {
  return result.successOrNot === COMMON_CONSTANT.YES_FLAG && 
         result.statusCode === CommonStatus.SUCCESS;
}

// Get error message from CommonStatus
export function getStatusMessage(status: CommonStatus): string {
  return COMMON_STATUS_DESCRIPTIONS[status] || '알 수 없는 오류';
}

// Generic API request function
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    mode: 'cors', // 명시적으로 CORS 모드 설정
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new ApiException(
        `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    const result: CommonResponse<T> = await response.json();
    
    // Check backend success flag
    if (!isSuccessResponse(result)) {
      const errorMessage = getStatusMessage(result.statusCode);
      throw new ApiException(
        errorMessage,
        response.status,
        result.statusCode
      );
    }

    return result.data;
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }
    throw new ApiException(
      error instanceof Error ? error.message : 'Unknown API error'
    );
  }
}

// Convenience methods for different HTTP verbs
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: HTTP_METHODS.GET }),
    
  post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: HTTP_METHODS.POST,
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  put: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: HTTP_METHODS.PUT,
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  patch: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: HTTP_METHODS.PATCH,
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: HTTP_METHODS.DELETE }),
}; 