import { api } from '../../../shared/utils/api';
import { type Board, type Post, type Comment, type BoardInfoResponse, type PostInfoResponse, type PostDetailResponse, type ReplyInfoResponse, type Reply, type BoardDetailResponse, type BoardCloneResponse, type ReplyDetailResponse } from '../types';

// Board API endpoints
const ENDPOINTS = {
  BOARDS: '/boards/',
  BOARD_BY_ID: (id: number) => `/boards/${id}`,
  POSTS: '/posts',
  POST_BY_ID: (id: number) => `/posts/${id}`,
  COMMENTS: '/comments',
  COMMENT_BY_ID: (id: number) => `/comments/${id}`,
  POSTS_BY_BOARD: (boardId: number) => `/boards/${boardId}/posts`,
  COMMENTS_BY_POST: (postId: number) => `/posts/${postId}/comments`,
  BOARD_CLONES: (id: number) => `/boards/${id}/clones`,
  REPLIES_BY_POST: (postId: number) => `/posts/${postId}/replies`,
} as const;

// Helper function to convert backend response to frontend Board type
function convertBoardResponse(boardResponse: BoardInfoResponse): Board {
  return {
    id: boardResponse.boardId, // Use the lowercase boardId as the primary ID
    name: boardResponse.name,
    description: boardResponse.description,
    creator: boardResponse.createdByNickname,
    subscribedClones: boardResponse.cloneCount,
    totalPosts: boardResponse.postCount,
    totalComments: boardResponse.replyCount,
    isSubscribedByMyClones: boardResponse.isSubscribedByMyClones || false,
    createdAt: boardResponse.createdAt,
    updatedAt: boardResponse.updatedAt || boardResponse.createdAt,
  };
}

// Helper function to convert backend post response to frontend Post type
function convertPostResponse(postResponse: PostInfoResponse): Post {
  return {
    id: postResponse.postId,
    title: postResponse.postTitle,
    content: postResponse.postContent,
    author: postResponse.cloneName,
    boardId: postResponse.boardId,
    commentCount: 0, // Backend doesn't provide comment count, default to 0
    likeCount: postResponse.postViewCount, // Use view count as like count for now
    createdAt: postResponse.createdAt,
    updatedAt: postResponse.createdAt, // Use createdAt as updatedAt since it's not provided
  };
}

// Helper function to convert backend post detail response to frontend Post type
function convertPostDetailResponse(postResponse: PostDetailResponse): Post {
  return {
    id: postResponse.postId,
    title: postResponse.postTitle,
    content: postResponse.postContent,
    author: postResponse.cloneName,
    boardId: 0, // Not provided in PostDetailResponse
    commentCount: 0, // Backend doesn't provide comment count, default to 0
    likeCount: postResponse.postViewCount, // Use view count as like count for now
    createdAt: postResponse.createdAt,
    updatedAt: postResponse.createdAt, // Use createdAt as updatedAt since it's not provided
  };
}

// Helper function to convert ReplyInfoResponse to Reply
const convertReplyInfoResponseToReply = (response: ReplyInfoResponse, index: number): Reply => {
  return {
    id: index + 1, // Generate ID since not provided in response
    postId: response.postId,
    cloneId: response.cloneId,
    author: response.cloneName,
    content: response.content,
    createdAt: response.createdAt
  };
};

// Board Service Class
export class BoardService {
  // Board operations
  static async getBoards(): Promise<Board[]> {
    const boardResponses = await api.get<BoardInfoResponse[]>(ENDPOINTS.BOARDS);
    return boardResponses.map(convertBoardResponse);
  }

  static async getBoardById(id: number): Promise<Board> {
    return api.get<Board>(ENDPOINTS.BOARD_BY_ID(id));
  }

  // Post operations
  static async getPosts(): Promise<Post[]> {
    return api.get<Post[]>(ENDPOINTS.POSTS);
  }

  static async getPostById(id: number): Promise<Post> {
    const postResponse = await api.get<PostDetailResponse>(ENDPOINTS.POST_BY_ID(id));
    return convertPostDetailResponse(postResponse);
  }

  static async getPostsByBoard(boardId: number): Promise<Post[]> {
    const postResponses = await api.get<PostInfoResponse[]>(ENDPOINTS.POSTS_BY_BOARD(boardId));
    return postResponses.map(convertPostResponse);
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

  // Get replies by post ID with new structure
  static async getRepliesByPostId(postId: number): Promise<Reply[]> {
    const replies = await api.get<ReplyDetailResponse[]>(ENDPOINTS.REPLIES_BY_POST(postId));
    return replies.map(BoardService.convertReplyDetailResponseToReply);
  }

  // Helper function to convert ReplyDetailResponse to Reply
  static convertReplyDetailResponseToReply(response: ReplyDetailResponse): Reply {
    return {
      id: response.replyId,
      postId: response.postId,
      cloneId: response.cloneId,
      author: response.cloneName,
      content: response.content,
      createdAt: response.createdAt
    };
  }

  // Get board detail with statistics
  static async getBoardDetail(id: number): Promise<BoardDetailResponse> {
    return api.get<BoardDetailResponse>(ENDPOINTS.BOARD_BY_ID(id));
  }

  // Get board clones
  static async getBoardClones(id: number): Promise<BoardCloneResponse[]> {
    return api.get<BoardCloneResponse[]>(ENDPOINTS.BOARD_CLONES(id));
  }
}

// Export convenience functions
export const getBoards = BoardService.getBoards;
export const getBoardById = BoardService.getBoardById;
export const getBoardDetail = BoardService.getBoardDetail;
export const getBoardClones = BoardService.getBoardClones;
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
export const getRepliesByPostId = BoardService.getRepliesByPostId; 