import { type BaseEntity } from '../../../shared/types';

export interface Board extends BaseEntity {
  name: string;
  description: string;
  creator: string;
  subscribedClones: number;
  totalPosts: number;
  totalComments: number;
  isSubscribedByMyClones: boolean;
}

// Backend response structure based on actual API
export interface BoardInfoResponse {
  boardId: number;
  name: string;
  description: string;
  createdByNickname: string;
  cloneCount: number;
  postCount: number;
  replyCount: number;
  createdAt: string;
  // Optional fields that might not be in the response
  isSubscribedByMyClones?: boolean;
  updatedAt?: string;
}

export interface Post extends BaseEntity {
  title: string;
  content: string;
  author: string;
  boardId: number;
  commentCount: number;
  likeCount?: number;
}

export interface Comment extends BaseEntity {
  content: string;
  author: string;
  postId: number;
  parentId?: number;
} 