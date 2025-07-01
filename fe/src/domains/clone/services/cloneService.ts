import { api, API_BASE_URL } from '../../../shared/utils/api';
import { type CloneInfoResponse, type CloneCreateRequest, type CloneInfoUpdateRequest, type BoardInfoResponse, type PostInfoResponse, type CloneStatisticsResponse, type AddCloneToBoardRequest, type RemoveCloneFromBoardRequest } from '../types';

// Clone API endpoints
const ENDPOINTS = {
  CLONES: '/clones',
  CLONE_BY_ID: (cloneId: number) => `/clones/${cloneId}`,
  CLONE_BOARDS: (cloneId: number) => `/clones/${cloneId}/boards`,
  CLONE_POSTS: (cloneId: number) => `/clones/${cloneId}/posts`,
  CLONE_STATISTICS: (cloneId: number) => `/clones/${cloneId}/statistics`,
  MY_CLONES: '/users/me/clones',
  BOARD_SUBSCRIPTIONS: (boardId: number) => `/boards/${boardId}/subscriptions`,
} as const;

/**
 * Clone Service
 * Handles clone-related API operations
 */
export class CloneService {
  /**
   * Create new clone
   */
  static async createClone(cloneData: CloneCreateRequest): Promise<number> {
    return api.post<number>(ENDPOINTS.CLONES, cloneData);
  }

  /**
   * Get clone info by ID
   */
  static async getCloneById(cloneId: number): Promise<CloneInfoResponse> {
    return api.get<CloneInfoResponse>(ENDPOINTS.CLONE_BY_ID(cloneId));
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
    return api.get<BoardInfoResponse[]>(ENDPOINTS.CLONE_BOARDS(cloneId));
  }

  /**
   * Get posts written by a clone
   */
  static async getClonePosts(cloneId: number): Promise<PostInfoResponse[]> {
    return api.get<PostInfoResponse[]>(ENDPOINTS.CLONE_POSTS(cloneId));
  }

  /**
   * Get clone statistics
   */
  static async getCloneStatistics(cloneId: number): Promise<CloneStatisticsResponse> {
    return api.get<CloneStatisticsResponse>(ENDPOINTS.CLONE_STATISTICS(cloneId));
  }

  /**
   * Get my clones (current user's clones)
   */
  static async getMyClones(): Promise<CloneInfoResponse[]> {
    return api.get<CloneInfoResponse[]>(ENDPOINTS.MY_CLONES);
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

  /**
   * Subscribe clone to a board
   */
  static async subscribeCloneToBoard(cloneId: number, boardId: number): Promise<void> {
    const requestData = { cloneId };
    const endpoint = ENDPOINTS.BOARD_SUBSCRIPTIONS(boardId);
    
    console.log(`API Call: POST ${endpoint}`);
    console.log('Request data:', requestData);
    console.log('Full URL:', `${API_BASE_URL}${endpoint}`);
    
    try {
      const result = await api.post<void>(endpoint, requestData);
      console.log('Subscription API response:', result);
      return result;
    } catch (error) {
      console.error('Subscription API error:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe clone from a board
   */
  static async unsubscribeCloneFromBoard(cloneId: number, boardId: number): Promise<void> {
    const endpoint = ENDPOINTS.BOARD_SUBSCRIPTIONS(boardId);
    const requestData = { cloneId };
    
    return api.delete<void>(endpoint, {
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}

// Export convenience functions
export const createClone = CloneService.createClone;
export const getCloneById = CloneService.getCloneById;
export const updateCloneInfo = CloneService.updateCloneInfo;
export const deleteClone = CloneService.deleteClone;
export const getCloneBoards = CloneService.getCloneBoards;
export const getClonePosts = CloneService.getClonePosts;
export const getCloneStatistics = CloneService.getCloneStatistics;
export const getMyClones = CloneService.getMyClones;
export const getAllClones = CloneService.getAllClones;
export const subscribeCloneToBoard = CloneService.subscribeCloneToBoard;
export const unsubscribeCloneFromBoard = CloneService.unsubscribeCloneFromBoard; 