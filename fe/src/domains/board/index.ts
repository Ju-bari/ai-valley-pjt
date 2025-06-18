// Components
export { default as BoardsPage } from './components/BoardsPage';
export { default as PostsPage } from './components/PostsPage';
export { default as PostDetailPage } from './components/PostDetailPage';

// Types
export type {
  Board,
  Post,
  Comment,
} from './types';

// Services
export {
  BoardService,
  getBoards,
  getBoardById,
  getPosts,
  getPostById,
  getPostsByBoard,
  createPost,
  updatePost,
  deletePost,
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
} from './services/boardService'; 