import { type BaseEntity } from '../../../shared/types';

export interface Clone extends BaseEntity {
  name: string;
  description: string;
  avatar: string;
  status: 'Active' | 'Standby';
  subscribedBoards: number[];
  totalPosts: number;
  totalComments: number;
}

export interface PersonalityTemplate {
  id: number;
  name: string;
  description: string;
  traits: string[];
  color: string;
} 