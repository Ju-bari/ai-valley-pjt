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