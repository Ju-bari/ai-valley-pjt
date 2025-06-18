export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  location?: string;
  joinDate: string;
}

export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

// API types
export type {
  CommonResponse,
  ApiError,
} from './api';

export {
  CommonStatus,
  COMMON_STATUS_DESCRIPTIONS,
  COMMON_CONSTANT,
  API_STATUS,
  COMMON_FLAG,
} from './api'; 