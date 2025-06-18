import { api } from '../../../shared/utils/api';
import { type Board, type Post, type Comment } from '../types';

// Board API endpoints
const ENDPOINTS = {
  BOARDS: '/boards',
  BOARD_BY_ID: (id: number) => `/boards/${id}`,
  POSTS: '/posts',
  POST_BY_ID: (id: number) => `/posts/${id}`,
  COMMENTS: '/comments',
  COMMENT_BY_ID: (id: number) => `/comments/${id}`,
  POSTS_BY_BOARD: (boardId: number) => `/boards/${boardId}/posts`,
  COMMENTS_BY_POST: (postId: number) => `/posts/${postId}/comments`,
} as const;

// Board Service Class
export class BoardService {
  // Board operations
  static async getBoards(): Promise<Board[]> {
    return api.get<Board[]>(ENDPOINTS.BOARDS);
  }

  static async getBoardById(id: number): Promise<Board> {
    return api.get<Board>(ENDPOINTS.BOARD_BY_ID(id));
  }

  // Post operations
  static async getPosts(): Promise<Post[]> {
    return api.get<Post[]>(ENDPOINTS.POSTS);
  }

  static async getPostById(id: number): Promise<Post> {
    return api.get<Post>(ENDPOINTS.POST_BY_ID(id));
  }

  static async getPostsByBoard(boardId: number): Promise<Post[]> {
    return api.get<Post[]>(ENDPOINTS.POSTS_BY_BOARD(boardId));
  }

  static async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    return api.post<Post>(ENDPOINTS.POSTS, postData);
  }

  static async updatePost(id: number, postData: Partial<Post>): Promise<Post> {
    return api.patch<Post>(ENDPOINTS.POST_BY_ID(id), postData);
  }

  static async deletePost(id: number): Promise<void> {
    return api.delete<void>(ENDPOINTS.POST_BY_ID(id));
  }

  // Comment operations
  static async getCommentsByPost(postId: number): Promise<Comment[]> {
    return api.get<Comment[]>(ENDPOINTS.COMMENTS_BY_POST(postId));
  }

  static async createComment(commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
    return api.post<Comment>(ENDPOINTS.COMMENTS, commentData);
  }

  static async updateComment(id: number, commentData: Partial<Comment>): Promise<Comment> {
    return api.patch<Comment>(ENDPOINTS.COMMENT_BY_ID(id), commentData);
  }

  static async deleteComment(id: number): Promise<void> {
    return api.delete<void>(ENDPOINTS.COMMENT_BY_ID(id));
  }
}

// Export convenience functions
export const getBoards = BoardService.getBoards;
export const getBoardById = BoardService.getBoardById;
export const getPosts = BoardService.getPosts;
export const getPostById = BoardService.getPostById;
export const getPostsByBoard = BoardService.getPostsByBoard;
export const createPost = BoardService.createPost;
export const updatePost = BoardService.updatePost;
export const deletePost = BoardService.deletePost;
export const getCommentsByPost = BoardService.getCommentsByPost;
export const createComment = BoardService.createComment;
export const updateComment = BoardService.updateComment;
export const deleteComment = BoardService.deleteComment; 