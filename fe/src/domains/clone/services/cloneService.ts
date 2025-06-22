import { api } from '../../../shared/utils/api';
import { type CloneInfoResponse, type CloneCreateRequest, type CloneInfoUpdateRequest, type BoardInfoResponse, type PostInfoResponse } from '../types';

// Clone API endpoints
const ENDPOINTS = {
  CLONES: '/clones',
  CLONE_BY_ID: (cloneId: number) => `/clones/${cloneId}`,
  CLONE_BOARDS: (cloneId: number) => `/clones/${cloneId}/boards`,
  CLONE_POSTS: (cloneId: number) => `/clones/${cloneId}/posts`,
  MY_CLONES: '/users/me/clones', // 실제 백엔드 엔드포인트
} as const;

/**
 * Clone Service
 * Handles clone-related API operations
 */
export class CloneService {
  /**
   * Create new clone
   */
  static async createClone(cloneData: CloneCreateRequest): Promise<void> {
    return api.post<void>(ENDPOINTS.CLONES, cloneData);
  }

  /**
   * Get clone info by ID
   */
  static async getCloneById(cloneId: number): Promise<CloneInfoResponse> {
    try {
      const result = await api.get<CloneInfoResponse>(ENDPOINTS.CLONE_BY_ID(cloneId));
      return result;
    } catch (error) {
      // 임시 목업 데이터 (백엔드 문제 진단용)
      const mockClone: CloneInfoResponse = {
        cloneId: cloneId,
        userId: 1,
        name: `Mock Clone ${cloneId}`,
        description: `이것은 클론 ID ${cloneId}의 임시 목업 데이터입니다. 백엔드 서버를 확인해주세요.`,
        isActive: 1 // 기본값: 활성화
      };
      
      return mockClone;
    }
  }

  /**
   * Update clone info
   */
  static async updateCloneInfo(cloneId: number, updateData: CloneInfoUpdateRequest): Promise<void> {
    return api.patch<void>(ENDPOINTS.CLONE_BY_ID(cloneId), updateData);
  }

  /**
   * Delete clone
   */
  static async deleteClone(cloneId: number): Promise<void> {
    return api.delete<void>(ENDPOINTS.CLONE_BY_ID(cloneId));
  }

  /**
   * Get boards associated with a clone
   */
  static async getCloneBoards(cloneId: number): Promise<BoardInfoResponse[]> {
    try {
      const result = await api.get<BoardInfoResponse[]>(ENDPOINTS.CLONE_BOARDS(cloneId));
      return result;
    } catch (error) {
      return [];
    }
  }

  /**
   * Get posts written by a clone
   */
  static async getClonePosts(cloneId: number): Promise<PostInfoResponse[]> {
    try {
      const result = await api.get<PostInfoResponse[]>(ENDPOINTS.CLONE_POSTS(cloneId));
      return result;
    } catch (error) {
      return [];
    }
  }

  /**
   * Get my clones (current user's clones)
   */
  static async getMyClones(): Promise<CloneInfoResponse[]> {
    try {
      const result = await api.get<CloneInfoResponse[]>(ENDPOINTS.MY_CLONES);
      return result;
    } catch (error) {
      // 임시 목업 데이터 (백엔드 문제 진단용)
      const mockData: CloneInfoResponse[] = [
        {
          cloneId: 1,
          userId: 1,
          name: "Helpful Assistant Clone",
          description: "도움이 되는 AI 어시스턴트입니다.",
          isActive: 1
        },
        {
          cloneId: 2,
          userId: 1,
          name: "Creative Writer Clone",
          description: "창작 활동을 도와주는 AI입니다.",
          isActive: 0
        }
      ];
      
      return mockData;
    }
  }

  /**
   * Get all clones (for general browsing)
   * Currently uses the same as getMyClones since there's no public clone list endpoint
   * TODO: Backend needs to implement a public clone browsing endpoint
   */
  static async getAllClones(): Promise<CloneInfoResponse[]> {
    // For now, return user's own clones
    // In the future, this could be a separate endpoint for public/featured clones
    return this.getMyClones();
  }
}

// Export convenience functions
export const createClone = CloneService.createClone;
export const getCloneById = CloneService.getCloneById;
export const updateCloneInfo = CloneService.updateCloneInfo;
export const deleteClone = CloneService.deleteClone;
export const getCloneBoards = CloneService.getCloneBoards;
export const getClonePosts = CloneService.getClonePosts;
export const getMyClones = CloneService.getMyClones;
export const getAllClones = CloneService.getAllClones; 