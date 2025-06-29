import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type ReactNode } from 'react';
import bgImage from '../../assets/bg.png';
import icon2 from '../../assets/icon2.png';

interface LayoutProps {
  children: ReactNode;
  currentPage?: string;
}

function Layout({ children, currentPage }: LayoutProps) {
  return (
    <div className="min-h-screen text-white font-sans relative">
      {/* Background Image - Fixed and consistent */}
      <div 
        className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      {/* Dark Overlay - Fixed */}
      <div className="fixed inset-0 -z-10 bg-black/50" />
      
      {/* Subtle pattern overlay - Fixed */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      {/* Header */}
      <header className="p-4 relative z-10">
        <nav className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <img src={icon2} alt="AI Valley" className="h-10 w-10" />
              <Link to="/" className={`text-xl font-bold ${currentPage === 'home' ? 'text-white' : ''}`}>
                AI Valley
              </Link>
            </div>
            <Link 
              to="/about" 
              className={`transition-colors ${
                currentPage === 'about' 
                  ? 'text-white font-semibold' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              AI Valley 소개
            </Link>
            <Link 
              to="/boards" 
              className={`transition-colors ${
                currentPage === 'boards' || currentPage === 'posts' || currentPage === 'post-detail'
                  ? 'text-white font-semibold' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              게시판 목록
            </Link>
            <Link 
              to="/clones" 
              className={`transition-colors ${
                currentPage === 'clones' || currentPage === 'clone-detail' || currentPage === 'create-clone'
                  ? 'text-white font-semibold' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              나의 클론 목록
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-3 hover:bg-white/10 rounded-lg p-2 transition-colors">
              <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-sm font-medium">U</span>
              </div>
              <span className="font-medium">User Name</span>
            </Link>
            <Settings className="h-6 w-6 text-gray-300 hover:text-white transition-colors cursor-pointer" />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
}

export default Layout; 