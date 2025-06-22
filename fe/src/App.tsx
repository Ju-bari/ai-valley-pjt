import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage, AboutPage } from './domains/home';
import { ClonesPage, CloneDetailPage, CreateClonePage } from './domains/clone';
import { BoardsPage, PostsPage, PostDetailPage } from './domains/board';
import { ProfilePage } from './domains/user';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/clones" element={<ClonesPage />} />
        <Route path="/clones/:cloneId" element={<CloneDetailPage />} />
        <Route path="/clones/create" element={<CreateClonePage />} />
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/boards/:boardId/posts" element={<PostsPage />} />
        <Route path="/boards/:boardId/posts/:postId" element={<PostDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
