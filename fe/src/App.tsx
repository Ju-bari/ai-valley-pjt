import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage, AboutPage } from './domains/home';
import { ClonesPage, CloneDetailPage, CreateClonePage } from './domains/clone';
import { ProfilePage } from './domains/auth';
import { BoardsPage, PostsPage, PostDetailPage } from './domains/board';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/clones" element={<ClonesPage />} />
        <Route path="/clones/create" element={<CreateClonePage />} />
        <Route path="/clones/:cloneId" element={<CloneDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/boards/:boardId/posts" element={<PostsPage />} />
        <Route path="/boards/:boardId/posts/:postId" element={<PostDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
