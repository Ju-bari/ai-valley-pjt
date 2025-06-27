import { api, ApiException } from '../../../shared/utils/api';
import { 
  type UserInfoResponse, 
  type UserInfoUpdateRequest, 
  type SignupRequest,
  type UserData,
  type Activity,
  type UserStatisticsResponse
} from '../types';
import { type CloneInfoResponse } from '../../clone/types';

// User API endpoints
const ENDPOINTS = {
  ME: '/users/me',
  ME_STATISTICS: '/users/me/statistics',
  SIGNUP: '/users/signup',
  MY_CLONES: '/users/me/clones',
  MY_BOARDS: '/users/me/boards',
} as const;

// User Service Class
export class UserService {
  // Get current user info
  static async getUserInfo(): Promise<UserInfoResponse> {
    return api.get<UserInfoResponse>(ENDPOINTS.ME);
  }

  // Get current user statistics
  static async getUserStatistics(): Promise<UserStatisticsResponse> {
    return api.get<UserStatisticsResponse>(ENDPOINTS.ME_STATISTICS);
  }

  // Update current user info
  static async updateUserInfo(updateData: UserInfoUpdateRequest): Promise<number> {
    return api.patch<number>(ENDPOINTS.ME, updateData);
  }

  // User signup
  static async signup(signupData: SignupRequest): Promise<number> {
    return api.post<number>(ENDPOINTS.SIGNUP, signupData);
  }

  // Get current user's clones
  static async getUserClones(): Promise<CloneInfoResponse[]> {
    return api.get<CloneInfoResponse[]>(ENDPOINTS.MY_CLONES);
  }

  // Get complete user data (info + statistics)
  static async getCompleteUserData(): Promise<UserData> {
    // 실제 API 호출 시도
    const [userInfo, userStats] = await Promise.allSettled([
      UserService.getUserInfo(),
      UserService.getUserStatistics()
    ]);

    // Handle user info (required)
    if (userInfo.status === 'fulfilled') {
      // Handle statistics (optional - use defaults if failed)
      const statistics = userStats.status === 'fulfilled' 
        ? userStats.value 
        : { postCount: 0, replyCount: 0, cloneCount: 0 };

      return UserService.transformToUserData(userInfo.value, statistics);
    } else {
      // API 호출 실패시 에러를 throw하여 ProfilePage에서 에러 상태를 표시하도록 함
      const originalError = userInfo.reason;
      
      if (originalError instanceof ApiException) {
        throw originalError;
      } else {
        throw new ApiException('사용자 정보를 불러올 수 없습니다.');
      }
    }
  }

  // Transform API response to internal UserData format
  static transformToUserData(
    userInfo: UserInfoResponse, 
    statistics: UserStatisticsResponse
  ): UserData {
    // Temporary activity data - replace with real API calls when available
    const tempActivity: Activity[] = [
      {
        id: 1,
        type: 'post',
        title: '최근 게시글 활동',
        content: '게시글을 작성했습니다.',
        boardName: 'AI 토론',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        type: 'comment',
        title: '댓글 활동',
        content: '댓글을 작성했습니다.',
        postTitle: '머신러닝 최신 동향',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        type: 'clone',
        title: '클론 생성',
        cloneName: 'AI 어시스턴트',
        action: '새로운 AI 클론을 생성했습니다.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    return {
      id: userInfo.userId,
      name: userInfo.nickname,
      email: userInfo.email,
      avatar: '', // API에서 제공하지 않음
      joinDate: userInfo.createAt,
      totalClones: statistics.cloneCount,
      totalPosts: statistics.postCount,
      totalComments: statistics.replyCount,
      recentActivity: tempActivity
    };
  }
}

// Export convenience functions for easier imports
export const getUserInfo = UserService.getUserInfo;
export const getUserStatistics = UserService.getUserStatistics;
export const getUserClones = UserService.getUserClones;
export const getCompleteUserData = UserService.getCompleteUserData;
export const updateUserInfo = UserService.updateUserInfo;
export const signup = UserService.signup;
export const transformToUserData = UserService.transformToUserData; 