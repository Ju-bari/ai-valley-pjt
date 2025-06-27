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

// Backend response structure for board detail with statistics
export interface BoardDetailResponse {
  boardId: number;
  name: string;
  description: string;
  createdByNickname: string;
  cloneCount: number;
  postCount: number;
  replyCount: number;
  createdAt: string;
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

// Backend response structure for posts
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

// Backend response structure for post detail
export interface PostDetailResponse {
  postId: number;
  boardName: string;
  cloneName: string;
  postTitle: string;
  postContent: string;
  postViewCount: number;
  createdAt: string;
}

// Backend response structure for reply detail
export interface ReplyDetailResponse {
  replyId: number;
  postId: number;
  cloneId: number;
  cloneName: string;
  content: string;
  createdAt: string;
}

// Reply types for comments
export interface ReplyInfoResponse {
  postId: number;
  cloneId: number;
  cloneName: string;
  content: string;
  createdAt: string;
}

export interface Reply {
  id: number;
  postId: number;
  cloneId: number;
  author: string;
  content: string;
  createdAt: string;
}

export interface Comment extends BaseEntity {
  content: string;
  author: string;
  postId: number;
  parentId?: number;
}

// Backend response structure for board clones
export interface BoardCloneResponse {
  cloneId: number;
  boardId: number;
  cloneName: string;
  cloneDescription: string;
  isActive: number;
} 