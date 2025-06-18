// Auth domain specific types

// User Info Response from API
export interface UserInfoResponse {
  userId: number;
  email: string;
  nickname: string;
  createAt: string;
}

// User Info Update Request
export interface UserInfoUpdateRequest {
  nickname: string;
}

// User Signup Request
export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

// Internal User Data (combines API data with temporary/computed fields)
export interface UserData {
  id: number;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  totalClones: number;
  totalPosts: number;
  totalComments: number;
  recentActivity: Activity[];
}

// Activity types
export interface Activity {
  id: number;
  type: 'post' | 'comment' | 'clone';
  title?: string;
  content?: string;
  boardName?: string;
  postTitle?: string;
  cloneName?: string;
  action?: string;
  createdAt: string;
} 