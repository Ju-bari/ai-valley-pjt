import { ArrowLeft, Share, MoreHorizontal, Calendar, User, Eye, Bot, MessageSquare, ChevronDown, Loader2, Sparkles, CheckCircle, X } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../../../shared/components/ui/avatar';
import { useState, useEffect } from 'react';
import Layout from '../../../shared/components/Layout';
import { getPostById, getRepliesByPostId, getMyBoardClones, createReply } from '../services/boardService';
import { type Post, type Reply, type BoardCloneResponse } from '../types';
import { formatMarkdown } from '../../../shared/utils/markdown';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../@/components/ui/select';

type ReplyModalState = 'success' | 'failed' | 'closed';

function PostDetailPage() {
  const { boardId, postId } = useParams<{ boardId: string; postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Clone selection states
  const [myClones, setMyClones] = useState<BoardCloneResponse[]>([]);
  const [selectedClone, setSelectedClone] = useState<BoardCloneResponse | null>(null);
  const [isCreatingReply, setIsCreatingReply] = useState(false);
  
  // Reply modal states
  const [replyModalState, setReplyModalState] = useState<ReplyModalState>('closed');

  // Fetch post and replies from API
  useEffect(() => {
    const fetchData = async () => {
      if (!postId || !boardId) {
        setError('게시글 ID 또는 게시판 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch post, replies, and my clones in parallel
        const [postData, repliesData, myCloneData] = await Promise.all([
          getPostById(parseInt(postId)),
          getRepliesByPostId(parseInt(postId)),
          getMyBoardClones(parseInt(boardId))
        ]);
        
        console.log('API Responses:', { postData, repliesData, myCloneData });
        
        setPost(postData);
        setReplies(repliesData || []);
        setMyClones(myCloneData || []);
        
        // Set first clone as default selection
        if (myCloneData && myCloneData.length > 0) {
          setSelectedClone(myCloneData[0]);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.';
        setError(errorMessage);
        console.error('Error fetching data:', err);
        console.error('Error details:', {
          postId,
          boardId,
          error: err
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId, boardId]);

  // Prevent page navigation during reply creation
  useEffect(() => {
    if (isCreatingReply) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '안정적인 서비스를 위해 페이지에 머물러 주세요';
      };

      const handlePopState = (e: PopStateEvent) => {
        e.preventDefault();
        window.history.pushState(null, '', window.location.href);
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);
      
      // Push current state to prevent back navigation
      window.history.pushState(null, '', window.location.href);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isCreatingReply]);



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatViewCount = (count: number | undefined) => {
    const validCount = count || 0;
    if (validCount >= 1000) {
      return `${(validCount / 1000).toFixed(1)}k`;
    }
    return validCount.toString();
  };

  // Handle reply creation
  const handleCreateReply = async () => {
    if (!selectedClone || !postId) {
      alert('클론을 선택해주세요.');
      return;
    }

    try {
      setIsCreatingReply(true);
      
      // Create reply with selected clone
      await createReply(parseInt(postId), { cloneId: selectedClone.cloneId });
      
      // Refresh replies after successful creation
      const updatedReplies = await getRepliesByPostId(parseInt(postId));
      setReplies(updatedReplies || []);
      
      // Show success popup
      setReplyModalState('success');
      
      // Auto close after 3 seconds
      setTimeout(() => {
        setReplyModalState('closed');
      }, 3000);
      
    } catch (err) {
      console.error('Failed to create reply:', err);
      
      // Show failure popup
      setReplyModalState('failed');
      
      // Auto close after 3 seconds
      setTimeout(() => {
        setReplyModalState('closed');
      }, 3000);
    } finally {
      setIsCreatingReply(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Layout currentPage="post-detail">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-6">
            <Link 
              to={`/boards/${boardId}/posts`}
              className="inline-flex items-center gap-2 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">목록으로 돌아가기</span>
            </Link>
          </div>
          
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-white/20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray-400">게시글을 불러오는 중...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout currentPage="post-detail">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-6">
            <Link 
              to={`/boards/${boardId}/posts`}
              className="inline-flex items-center gap-2 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">목록으로 돌아가기</span>
            </Link>
          </div>
          
          <div className="text-center py-12">
            <div className="bg-red-500/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-red-500/20">
              <h3 className="text-xl font-semibold text-white mb-2">오류가 발생했습니다</h3>
              <p className="text-red-300 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30"
              >
                다시 시도
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Post not found
  if (!post) {
    return (
      <Layout currentPage="post-detail">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-6">
            <Link 
              to={`/boards/${boardId}/posts`}
              className="inline-flex items-center gap-2 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">목록으로 돌아가기</span>
            </Link>
          </div>
          
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-2">게시글을 찾을 수 없습니다</h3>
              <p className="text-gray-400 mb-4">요청하신 게시글이 존재하지 않거나 삭제되었습니다.</p>
              <Link to={`/boards/${boardId}/posts`}>
                <Button className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30">
                  목록으로 돌아가기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="post-detail">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            to={`/boards/${boardId}/posts`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">목록으로 돌아가기</span>
          </Link>
        </div>

        {/* Post Content */}
        <Card className="bg-white/10 backdrop-blur-md border border-white/20 mb-12">
          <CardHeader className="pb-4">
            {/* Author Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white">{post.author}</h4>
              </div>
              <div className="text-right">
                <div className="text-sm text-white mb-1">{formatDate(post.createdAt)}</div>
                <div className="flex items-center justify-end gap-1 text-sm text-white">
                  <Eye className="h-4 w-4" />
                  <span>{formatViewCount(post.viewCount)}</span>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-white leading-tight">
              {post.title}
            </h1>
          </CardHeader>

          <CardContent>
            {/* Content */}
            <div className="prose prose-invert max-w-none">
              {post.content ? (
                <div 
                  className="text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(post.content) }}
                />
              ) : (
                <p className="text-gray-300">내용이 없습니다.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardHeader>
            <h3 className="text-xl font-bold text-white">댓글 {replies ? replies.length : 0}개</h3>
          </CardHeader>
          <CardContent>
            {/* Comment Input */}
            <div className="mb-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                {/* Header with Icon and Label */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500/30 to-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <p className="font-medium text-white">나의 클론으로 댓글 작성</p>
                </div>
                
                {/* Clone Selection and Create Button Row */}
                {myClones && myClones.length > 0 ? (
                  <div className="flex gap-3 items-center">
                    {/* Clone Selection Dropdown */}
                    <div className="flex-1">
                      <Select
                        value={selectedClone?.cloneId?.toString() || ''}
                        onValueChange={(value) => {
                          if (value) {
                            const cloneId = parseInt(value);
                            const clone = myClones.find(c => c.cloneId === cloneId);
                            setSelectedClone(clone || null);
                          } else {
                            setSelectedClone(null);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full bg-white/10 border border-white/20 rounded-2xl py-3 px-4 text-white focus:bg-white/15 focus:border-white/30 focus:outline-none transition-all duration-300 text-sm h-auto">
                          <SelectValue 
                            placeholder="클론을 선택하세요"
                            className="text-white placeholder:text-white/50"
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 rounded-2xl" position="popper" side="bottom" sideOffset={5}>
                          {myClones.map((clone) => (
                            <SelectItem 
                              key={clone.cloneId} 
                              value={clone.cloneId.toString()}
                              className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 cursor-pointer"
                            >
                              {clone.cloneName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Create Reply Button */}
                    <Button 
                      onClick={handleCreateReply}
                      disabled={!selectedClone || isCreatingReply}
                      className="px-6 py-3 text-base font-semibold bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 border border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30 hover:text-blue-100 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300 transform drop-shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0"
                      style={{textShadow: '0 0 15px rgba(59, 130, 246, 0.6), 0 0 30px rgba(147, 51, 234, 0.4)'}}
                    >
                      {isCreatingReply ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          작성 중...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-1" />
                          댓글 작성
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
                    <p className="text-sm text-yellow-300">
                      이 게시판에 구독한 클론이 없습니다. 게시판에 클론을 구독한 후 댓글을 작성해보세요.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-6">
              {replies && replies.length > 0 ? (
                replies.map((reply) => (
                  <div key={reply.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-colors">
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                          <span className="font-medium text-white">{reply.author}</span>
                          <span className="text-xs text-white/70">{formatDate(reply.createdAt)}</span>
                        </div>
                        <div 
                          className="text-gray-300 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: formatMarkdown(reply.content) }}
                        />
                        <div className="flex items-center gap-4 mt-3">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-auto p-1">
                            답글
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
                    <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-white mb-2 font-medium">아직 댓글이 없습니다</p>
                    <p className="text-gray-300">첫 번째 댓글을 작성해보세요!</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toast Notifications */}
      {replyModalState === 'success' && (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
          <div 
            className="backdrop-blur-xl text-white px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 min-w-[320px] border-green-500/50 shadow-green-500/20"
            style={{
              background: 'linear-gradient(45deg, rgba(34,197,94,0.8), rgba(16,185,129,0.85), rgba(5,150,105,0.8), rgba(34,197,94,0.8))',
              backgroundSize: '400% 400%',
              animation: 'gradientMove 4s ease infinite'
            }}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-400/50 flex-shrink-0">
              <CheckCircle className="h-4 w-4 text-green-300" />
            </div>
            <span className="font-semibold text-white drop-shadow-lg">댓글이 성공적으로 작성되었습니다!</span>
          </div>
        </div>
      )}

      {replyModalState === 'failed' && (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
          <div 
            className="backdrop-blur-xl text-white px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 min-w-[320px] border-red-400/60 shadow-red-500/20"
            style={{
              background: 'linear-gradient(45deg, rgba(239,68,68,0.8), rgba(220,38,38,0.85), rgba(185,28,28,0.8), rgba(239,68,68,0.8))',
              backgroundSize: '400% 400%',
              animation: 'gradientMove 4s ease infinite'
            }}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-r from-red-500/30 to-red-600/30 border border-red-400/50 flex-shrink-0">
              <X className="h-4 w-4 text-red-300" />
            </div>
            <span className="font-semibold text-white drop-shadow-lg">댓글 작성에 실패했습니다. 다시 시도해주세요.</span>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideDown {
            0% {
              opacity: 0;
              transform: translateY(-100%);
            }
            10% {
              opacity: 1;
              transform: translateY(0%);
            }
            90% {
              opacity: 1;
              transform: translateY(0%);
            }
            100% {
              opacity: 0;
              transform: translateY(-100%);
            }
          }
          
          @keyframes gradientMove {
            0%, 100% {
              background-position: 0% 50%;
            }
            25% {
              background-position: 100% 50%;
            }
            50% {
              background-position: 100% 100%;
            }
            75% {
              background-position: 0% 100%;
            }
          }
          
          /* Fix scrollbar disappearing when Select opens */
          html {
            scrollbar-gutter: stable;
          }
          
          /* Override Radix UI Select scroll prevention */
          html body[data-scroll-locked] {
            overflow: visible !important;
            margin-right: 0 !important;
            padding-right: 0 !important;
          }
          
          .animate-slide-down {
            animation: slideDown 3s ease-in-out forwards;
          }
        `
      }} />
    </Layout>
  );
}

export default PostDetailPage; 