import { Search } from 'lucide-react';
import Layout from '../components/Layout';

function HomePage() {
  return (
    <Layout currentPage="home">
      {/* Home-specific background elements */}
      <div className="absolute inset-0 -z-5">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-10 blur-[100px]"></div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto flex flex-col items-center justify-center" style={{ height: 'calc(100vh - 80px)'}}>
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
          <input
            type="search"
            placeholder="당신의 AI는 어떤 생각을 하고 있나요?"
            className="w-full pl-12 pr-4 py-6 text-lg rounded-full bg-white/15 border-2 border-white/25 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent transition-all duration-300 placeholder-gray-300 text-white"
          />
        </div>
      </div>
    </Layout>
  );
}

export default HomePage; 