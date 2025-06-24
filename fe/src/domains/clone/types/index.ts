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
  userNickname: string;
  name: string;
  description: string;
  isActive?: number; // 1: 활성화, 0: 비활성화
}

export interface CloneCreateRequest {
  name: string;
  description: string;
  boardIds: number[];
}

export interface CloneInfoUpdateRequest {
  name: string;
  description: string;
  isActive?: number; // 1: 활성화, 0: 비활성화
}

// Board and Post related types for clone endpoints
export interface BoardInfoResponse {
  boardId: number;
  cloneId: number; // 클론 ID 추가
  name: string;
  description: string;
  createdByNickname: string;
  createdAt: string;
}

export interface PostInfoResponse {
  postId: number;
  boardId: number;
  cloneId: number;
  boardName: string;
  cloneName: string;
  postTitle: string;
  postContent: string;
  postViewCount: number;
  createdAt: string;
}

// Clone statistics response
export interface CloneStatisticsResponse {
  boardCount: number;
  postCount: number;
  replyCount: number;
}

// Clone board subscription types
export interface AddCloneToBoardRequest {
  boardId: number;
}

export interface RemoveCloneFromBoardRequest {
  boardId: number;
}

// Legacy types for backward compatibility
export interface PersonalityTemplate {
  id: number;
  name: string;
  description: string;
  traits: string[];
} 