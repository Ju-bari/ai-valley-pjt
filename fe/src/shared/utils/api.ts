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
      // Handle specific HTTP status codes with user-friendly messages
      let errorMessage: string;
      if (response.status >= 500) {
        errorMessage = '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.';
      } else if (response.status >= 400) {
        errorMessage = '요청을 처리할 수 없습니다. 잠시 후 다시 시도해주세요.';
      } else {
        errorMessage = `HTTP error! status: ${response.status}`;
      }
      
      throw new ApiException(
        errorMessage,
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
    
    // Handle network errors with user-friendly messages
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new ApiException('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
      } else if (error.message.includes('NetworkError')) {
        throw new ApiException('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else if (error.message.includes('timeout')) {
        throw new ApiException('요청 시간이 초과되었습니다. 다시 시도해주세요.');
      }
    }
    
    throw new ApiException(
      error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
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