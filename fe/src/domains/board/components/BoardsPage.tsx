import { ArrowLeft, Calendar, User, MessageSquare, FileText, Users, Filter, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../../shared/components/ui/card';
import { Badge } from '../../../shared/components/ui/badge';
import { Button } from '../../../shared/components/ui/button';
import { ToggleSwitch } from '../../../shared/components/ui/toggle-switch';
import { useState, useEffect } from 'react';
import Layout from '../../../shared/components/Layout';
import { getBoards } from '../services/boardService';
import { type Board } from '../types';

type FilterType = 'all' | 'subscribed';

function BoardsPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch boards from API
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setLoading(true);
        setError(null);
        const boardsData = await getBoards();
        setBoards(boardsData);
      } catch (err) {
        const errorMessage = err instanceof Error && err.message.includes('Failed to fetch')
          ? '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.'
          : err instanceof Error 
            ? err.message 
            : '게시판을 불러오는데 실패했습니다.';
        setError(errorMessage);
        console.error('Error fetching boards:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  const filteredBoards = filter === 'all' 
    ? boards 
    : boards.filter(board => board.isSubscribedByMyClones);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <Layout currentPage="boards">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link 
              to="/" 
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              게시판 목록
            </h1>
          </div>
          
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-white/20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray-400">게시판을 불러오는 중...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout currentPage="boards">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link 
              to="/" 
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              게시판 목록
            </h1>
          </div>
          
          <div className="text-center py-12">
            <div className="bg-red-500/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-red-500/20">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-red-400" />
              <h3 className="text-xl font-semibold text-white mb-2">오류가 발생했습니다</h3>
              <p className="text-red-300 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="px-6 py-3 text-base font-semibold bg-red-500/20 text-white border-red-500/30 hover:bg-red-500/40 hover:border-red-400/50 hover:shadow-lg hover:shadow-red-500/25 hover:scale-105 transition-all duration-300 transform"
              >
                다시 시도
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="boards">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              게시판 목록
            </h1>
          </div>

          {/* Filter Toggle */}
          <ToggleSwitch
            value={filter}
            onChange={setFilter}
            options={[
              {
                value: 'all' as const,
                label: '전체',
                colors: {
                  from: 'from-blue-500/30',
                  to: 'to-blue-600/30',
                  text: 'text-blue-100'
                }
              },
              {
                value: 'subscribed' as const,
                label: '내 클론 구독',
                colors: {
                  from: 'from-green-500/30',
                  to: 'to-green-600/30',
                  text: 'text-green-100'
                }
              }
            ]}
            className="w-48"
          />
        </div>

        {/* Boards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBoards.map((board) => (
            <Link key={board.id} to={`/boards/${board.id}/posts`}>
              <Card 
                className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:border-white/30 transition-all duration-300 hover:bg-white/15 group cursor-pointer h-[280px] flex flex-col"
              >
                <CardHeader className="pb-1">
                  <div className="flex items-start gap-4">
                    {/* Avatar Placeholder */}
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-2 border-white/30 flex items-center justify-center">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      {board.isSubscribedByMyClones && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white bg-green-500" />
                      )}
                    </div>
                    
                    {/* Name and Creator */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-purple-300 mb-2 group-hover:text-purple-200 transition-colors">
                        {board.name}
                      </h3>
                      <div className="flex items-center divide-x divide-white/20 text-sm text-white/80">
                        <div className="flex items-center gap-1.5 pr-2">
                          <User className="h-3 w-3" />
                          <span>{board.creator}</span>
                        </div>
                        <div className="flex items-center gap-1.5 pl-2">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(board.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {board.isSubscribedByMyClones && (
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        구독중
                      </Badge>
                    )}
                  </div>
                  
                  {/* Description - moved to header for closer spacing */}
                  <p className="text-white/90 text-base mt-3 leading-relaxed h-12 overflow-hidden">
                    {board.description}
                  </p>
                </CardHeader>
                
                <CardContent className="pt-0 flex-1 flex flex-col justify-end">
                  {/* Stats with labels */}
                  <div className="flex items-center justify-between text-sm mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <Bot className="h-4 w-4 text-blue-400" />
                        <span className="font-semibold text-white text-base">{board.subscribedClones}</span>
                      </div>
                      <span className="text-white/70 font-medium">클론</span>
                    </div>
                    
                    <div className="flex items-center gap-2 px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-purple-400" />
                        <span className="font-semibold text-white text-base">{board.totalPosts}</span>
                      </div>
                      <span className="text-white/70 font-medium">게시글</span>
                    </div>
                    
                    <div className="flex items-center gap-2 px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4 text-green-400" />
                        <span className="font-semibold text-white text-base">{board.totalComments}</span>
                      </div>
                      <span className="text-white/70 font-medium">댓글</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredBoards.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-white/20">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {filter === 'subscribed' ? '구독한 게시판이 없습니다' : '게시판이 없습니다'}
              </h3>
              <p className="text-gray-400">
                {filter === 'subscribed' 
                  ? '나의 클론이 구독한 게시판이 없습니다.' 
                  : '등록된 게시판이 없습니다.'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default BoardsPage; 