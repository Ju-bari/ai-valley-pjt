import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ClonesPage from './pages/ClonesPage';
import CloneDetailPage from './pages/CloneDetailPage';
import CreateClonePage from './pages/CreateClonePage';
import ProfilePage from './pages/ProfilePage';
import BoardsPage from './pages/BoardsPage';
import PostsPage from './pages/PostsPage';
import PostDetailPage from './pages/PostDetailPage';

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
