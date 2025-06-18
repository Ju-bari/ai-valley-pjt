// Common API Response Types (matches backend CommonResponse<T>)
export interface CommonResponse<T> {
  successOrNot: string;
  statusCode: CommonStatus;
  data: T;
}

// Base API Error
export interface ApiError {
  message: string;
  statusCode?: number;
}

// Common Status enum (matches backend CommonStatus)
export enum CommonStatus {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
}

// Common Status descriptions (matches backend)
export const COMMON_STATUS_DESCRIPTIONS = {
  [CommonStatus.SUCCESS]: '성공',
  [CommonStatus.FAIL]: '실패',
  [CommonStatus.INTERNAL_SERVER_ERROR]: '서버 오류',
  [CommonStatus.BAD_REQUEST]: '잘못된 요청',
} as const;

// Common Constants (matches backend CommonConstant)
export const COMMON_CONSTANT = {
  YES_FLAG: 'Y',
  NO_FLAG: 'N',
} as const;

// Legacy exports for backward compatibility
export const API_STATUS = {
  SUCCESS: CommonStatus.SUCCESS,
  ERROR: CommonStatus.FAIL,
} as const;

export const COMMON_FLAG = {
  YES: COMMON_CONSTANT.YES_FLAG,
  NO: COMMON_CONSTANT.NO_FLAG,
} as const; 