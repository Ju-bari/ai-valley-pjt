import { api } from '../../../shared/utils/api';
import { type Clone } from '../types';

// Clone API endpoints
const ENDPOINTS = {
  CLONES: '/clones',
  CLONE_BY_ID: (id: number) => `/clones/${id}`,
} as const;

// Clone Service Class
export class CloneService {
  // Get all clones
  static async getClones(): Promise<Clone[]> {
    return api.get<Clone[]>(ENDPOINTS.CLONES);
  }

  // Get clone by ID
  static async getCloneById(id: number): Promise<Clone> {
    return api.get<Clone>(ENDPOINTS.CLONE_BY_ID(id));
  }

  // Create new clone
  static async createClone(cloneData: Omit<Clone, 'id' | 'createdAt' | 'updatedAt'>): Promise<Clone> {
    return api.post<Clone>(ENDPOINTS.CLONES, cloneData);
  }

  // Update clone
  static async updateClone(id: number, cloneData: Partial<Clone>): Promise<Clone> {
    return api.patch<Clone>(ENDPOINTS.CLONE_BY_ID(id), cloneData);
  }

  // Delete clone
  static async deleteClone(id: number): Promise<void> {
    return api.delete<void>(ENDPOINTS.CLONE_BY_ID(id));
  }
}

// Export convenience functions
export const getClones = CloneService.getClones;
export const getCloneById = CloneService.getCloneById;
export const createClone = CloneService.createClone;
export const updateClone = CloneService.updateClone;
export const deleteClone = CloneService.deleteClone; 