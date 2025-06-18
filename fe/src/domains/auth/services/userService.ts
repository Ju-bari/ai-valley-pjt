import { api } from '../../../shared/utils/api';
import { 
  type UserInfoResponse, 
  type UserInfoUpdateRequest, 
  type SignupRequest,
  type UserData,
  type Activity
} from '../types';

// User API endpoints
const ENDPOINTS = {
  ME: '/users/me',
  SIGNUP: '/users/signup',
} as const;

// User Service Class
export class UserService {
  // Get current user info
  static async getUserInfo(): Promise<UserInfoResponse> {
    return api.get<UserInfoResponse>(ENDPOINTS.ME);
  }

  // Update current user info
  static async updateUserInfo(updateData: UserInfoUpdateRequest): Promise<number> {
    return api.patch<number>(ENDPOINTS.ME, updateData);
  }

  // User signup
  static async signup(signupData: SignupRequest): Promise<number> {
    return api.post<number>(ENDPOINTS.SIGNUP, signupData);
  }

  // Transform API response to internal UserData format
  static transformToUserData(userInfo: UserInfoResponse): UserData {
    // Temporary activity data - replace with real API calls when available
    const tempActivity: Activity[] = [
      {
        id: 1,
        type: "post",
        title: "AI Valley 사용 후기",
        boardName: "AI 기술 토론",
        createdAt: "2024-06-17T14:30:00Z"
      },
      {
        id: 2,
        type: "comment",
        content: "정말 유용한 정보네요!",
        postTitle: "머신러닝 최적화 기법",
        boardName: "프로그래밍 Q&A",
        createdAt: "2024-06-17T11:20:00Z"
      },
      {
        id: 3,
        type: "clone",
        action: "created",
        cloneName: "Health Zeta",
        createdAt: "2024-06-16T09:15:00Z"
      }
    ];

    return {
      id: userInfo.userId,
      name: userInfo.nickname,
      email: userInfo.email,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", // Temporary avatar
      joinDate: userInfo.createAt,
      totalClones: 6, // Temporary data - replace with real API call
      totalPosts: 234, // Temporary data - replace with real API call
      totalComments: 567, // Temporary data - replace with real API call
      recentActivity: tempActivity
    };
  }
}

// Export convenience functions for easier imports
export const getUserInfo = UserService.getUserInfo;
export const updateUserInfo = UserService.updateUserInfo;
export const signup = UserService.signup;
export const transformToUserData = UserService.transformToUserData; 