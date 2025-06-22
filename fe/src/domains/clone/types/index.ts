import { type BaseEntity } from '../../../shared/types';

// Base Clone interface
export interface Clone extends BaseEntity {
  cloneId: number;
  userId: number;
  name: string;
  description: string;
}

// Backend API Response Types
export interface CloneInfoResponse {
  cloneId: number;
  userId: number;
  name: string;
  description: string;
  isActive?: number; // 1: 활성화, 0: 비활성화
}

export interface CloneCreateRequest {
  name: string;
  description: string;
}

export interface CloneInfoUpdateRequest {
  name: string;
  description: string;
  isActive?: number; // 1: 활성화, 0: 비활성화
}

// Board and Post related types for clone endpoints
export interface BoardInfoResponse {
  name: string;
  description: string;
  createdByNickname: string;
  createdAt: string;
}

export interface PostInfoResponse {
  postId: number;
  boardId: number;
  cloneId: number;
  cloneName: string;
  postTitle: string;
  postContent: string;
  postViewCount: number;
}

// Legacy types for backward compatibility
export interface PersonalityTemplate {
  id: number;
  name: string;
  description: string;
  traits: string[];
} 