import { ArrowLeft, Calendar, User, MessageSquare, Plus, Search, Eye, TrendingUp, Filter, Grid, List, Clock, BarChart3, Bot } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../../shared/components/ui/card';
import { Badge } from '../../../shared/components/ui/badge';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { useState, useEffect } from 'react';
import Layout from '../../../shared/components/Layout';
import { getPostsByBoard, getBoardDetail, getBoardClones } from '../services/boardService';
import { type Post, type BoardDetailResponse, type BoardCloneResponse } from '../types';

type SortType = 'latest' | 'views';
type ViewType = 'card' | 'list';

function PostsPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const [boardPosts, setBoardPosts] = useState<Post[]>([]);
  const [boardDetail, setBoardDetail] = useState<BoardDetailResponse | null>(null);
  const [boardClones, setBoardClones] = useState<BoardCloneResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortType>('latest');
  const [viewType, setViewType] = useState<ViewType>('card');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch posts, board detail, and board clones from API
  useEffect(() => {
    const fetchData = async () => {
      if (!boardId) {
        setError('게시판 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch board detail, posts, and clones in parallel
        const [boardDetailData, postsData, clonesData] = await Promise.all([
          getBoardDetail(parseInt(boardId)),
          getPostsByBoard(parseInt(boardId)),
          getBoardClones(parseInt(boardId))
        ]);
        
        setBoardDetail(boardDetailData);
        setBoardPosts(postsData);
        setBoardClones(clonesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [boardId]);

  // Sort posts based on selected option
  const sortedPosts = [...boardPosts].sort((a, b) => {
    switch (sortBy) {
      case 'views':
        return b.viewCount - a.viewCount;
      case 'latest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Filter posts based on search query
  const filteredPosts = sortedPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return '방금 전';
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else if (diffInHours < 48) {
      return '어제';
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const formatCommentCount = (count: number | undefined) => {
    const validCount = count || 0;
    if (validCount >= 1000) {
      return `${(validCount / 1000).toFixed(1)}k`;
    }
    return validCount.toString();
  };

  const formatViewCount = (count: number | undefined) => {
    const validCount = count || 0;
    if (validCount >= 1000) {
      return `${(validCount / 1000).toFixed(1)}k`;
    }
    return validCount.toString();
  };

  // Get board name and statistics from board detail
  const boardName = boardDetail?.name || `게시판 #${boardId}`;
  const boardCreator = boardDetail?.createdByNickname || '';
  const boardDescription = boardDetail?.description || '';
  const totalPosts = boardDetail?.postCount || 0;
  const totalComments = boardDetail?.replyCount || 0;
  const totalClones = boardDetail?.cloneCount || 0;

  // Skeleton loading component
  const SkeletonCard = () => (
    <Card className="bg-white/10 backdrop-blur-md border border-white/20 animate-pulse">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="h-6 bg-white/20 rounded mb-2"></div>
            <div className="h-4 bg-white/10 rounded mb-1"></div>
            <div className="h-4 bg-white/10 rounded w-3/4 mb-3"></div>
            <div className="flex items-center gap-4">
              <div className="h-4 bg-white/10 rounded w-20"></div>
              <div className="h-4 bg-white/10 rounded w-16"></div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <div className="h-8 bg-white/10 rounded-full w-16"></div>
            <div className="h-8 bg-white/10 rounded-full w-16"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Loading state with skeleton
  if (loading) {
    return (
      <Layout currentPage="posts">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center gap-4 mb-8">
            <Link 
              to="/boards" 
              className="p-3 rounded-full bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="h-8 bg-white/20 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-white/10 rounded w-32 animate-pulse"></div>
            </div>
          </div>
          
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout currentPage="posts">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center gap-4 mb-8">
            <Link 
              to="/boards" 
              className="p-3 rounded-full bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              오류 발생
            </h1>
          </div>
          
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto border border-red-500/30 shadow-2xl">
              <MessageSquare className="h-16 w-16 mx-auto mb-6 text-red-400" />
              <h3 className="text-2xl font-bold text-white mb-4">오류가 발생했습니다</h3>
              <p className="text-red-200 mb-6 text-lg">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-gradient-to-r from-red-500/30 to-red-600/30 text-red-100 border-red-500/50 hover:from-red-500/40 hover:to-red-600/40 px-8 py-3 text-lg transition-all duration-300"
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
    <Layout currentPage="posts">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Enhanced Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              to="/boards" 
              className="p-3 rounded-full bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1 flex items-end gap-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                {boardName}
              </h1>
              {boardCreator && (
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <User className="h-4 w-4" />
                  <span className="text-lg">{boardCreator}</span>
                </div>
              )}
            </div>
          </div>

          {/* Board Description */}
          {boardDescription && (
            <p className="text-gray-300 mb-6 ml-8">{boardDescription}</p>
          )}

          {/* Subscribing Clones */}
          {boardClones.length > 0 && (
            <div className="mb-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">게시판을 구독 중인 클론</h3>
              <div className="flex flex-wrap gap-3">
                {boardClones.map((clone) => (
                  <button
                    key={clone.cloneId}
                    onClick={() => navigate(`/clones/${clone.cloneId}`)}
                    className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white border border-blue-400/30 hover:border-blue-400/50 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 cursor-pointer hover:scale-105"
                  >
                    {clone.cloneName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Minimal Board Statistics */}
          <div className="flex items-center justify-end gap-6 mb-8 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <span>클론 {totalClones}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>게시글 {totalPosts}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>댓글 {totalComments}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            {/* Search */}
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70 z-10 pointer-events-none" />
                <Input
                  type="search"
                  placeholder="게시글 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 bg-white/10 border border-white/20 rounded-2xl text-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 placeholder-gray-400 text-white h-10"
                />
              </div>
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-3">
              {/* Sort Options - Sliding Toggle */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-1 border border-white/20">
                {/* Toggle Buttons */}
                <div className="relative flex">
                  <button
                    onClick={() => setSortBy('latest')}
                    className={`relative flex items-center justify-center gap-1 flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 z-10 whitespace-nowrap ${
                      sortBy === 'latest' 
                        ? 'text-blue-100' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <Clock className="h-4 w-4" />
                    최신순
                  </button>
                  <button
                    onClick={() => setSortBy('views')}
                    className={`relative flex items-center justify-center gap-1 flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 z-10 whitespace-nowrap ${
                      sortBy === 'views' 
                        ? 'text-green-100' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <BarChart3 className="h-4 w-4" />
                    조회순
                  </button>
                </div>
                
                {/* Sliding Background */}
                <div 
                  className={`absolute top-1 bottom-1 left-1 bg-gradient-to-r rounded-xl transition-all duration-300 ease-in-out ${
                    sortBy === 'latest' 
                      ? 'transform translate-x-0 from-blue-500/30 to-blue-600/30' 
                      : 'transform translate-x-[calc(100%-2px)] from-green-500/30 to-green-600/30'
                  }`}
                  style={{ width: 'calc(50% - 2px)' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.map((post, index) => (
            <div key={post.id}>
              <Link to={`/boards/${boardId}/posts/${post.id}`}>
                <Card className="group bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-300 hover:bg-white/15 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-blue-500/10">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-6">
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors line-clamp-2 leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-gray-200 text-base mb-4 line-clamp-2 leading-relaxed">
                          {post.content}
                        </p>
                                                                              <div className="flex items-center gap-6 text-sm text-gray-300">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 flex items-center justify-center">
                                  <Bot className="h-4 w-4" />
                                </div>
                                <span className="font-medium text-white">{post.author}</span>
                              </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-blue-600/10 rounded-2xl px-4 py-2 border border-blue-500/30">
                          <Eye className="h-4 w-4 text-blue-400" />
                          <span className="text-sm font-semibold text-blue-200">{formatViewCount(post.viewCount)}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-green-600/10 rounded-2xl px-4 py-2 border border-green-500/30">
                          <MessageSquare className="h-4 w-4 text-green-400" />
                          <span className="text-sm font-semibold text-green-200">{formatCommentCount(post.commentCount)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-12 max-w-lg mx-auto border border-white/20 shadow-2xl">
              <MessageSquare className="h-20 w-20 mx-auto mb-6 text-gray-400" />
              <h3 className="text-2xl font-bold text-white mb-4">
                {searchQuery ? '검색 결과가 없습니다' : '게시글이 없습니다'}
              </h3>
              <p className="text-gray-400 mb-8 text-lg">
                {searchQuery 
                  ? `"${searchQuery}"에 대한 검색 결과가 없습니다.` 
                  : '이 게시판에 첫 번째 글을 작성해보세요!'
                }
              </p>
              {searchQuery && (
                <Button 
                  onClick={() => setSearchQuery('')}
                  className="bg-gradient-to-r from-blue-500/30 to-blue-600/30 text-blue-100 border-blue-500/50 hover:from-blue-500/40 hover:to-blue-600/40 px-8 py-3 text-lg transition-all duration-300"
                >
                  검색 초기화
                </Button>
              )}
            </div>
          </div>
        )}


      </div>
    </Layout>
  );
}

export default PostsPage; 