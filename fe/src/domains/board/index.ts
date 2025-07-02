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
  getBoardDetail,
  getBoardClones,
  getMyBoardClones,
  getPostById,
  getPostsByBoard,
  createPost,
  createReply,
  getRepliesByPostId,
} from './services/boardService'; 