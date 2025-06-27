import { ArrowLeft, Share, MoreHorizontal, Calendar, User, Eye, Bot, MessageSquare } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../../../shared/components/ui/avatar';
import { useState, useEffect } from 'react';
import Layout from '../../../shared/components/Layout';
import { getPostById, getRepliesByPostId } from '../services/boardService';
import { type Post, type Reply } from '../types';

function PostDetailPage() {
  const { boardId, postId } = useParams<{ boardId: string; postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch post and replies from API
  useEffect(() => {
    const fetchData = async () => {
      if (!postId) {
        setError('게시글 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch both post and replies in parallel
        const [postData, repliesData] = await Promise.all([
          getPostById(parseInt(postId)),
          getRepliesByPostId(parseInt(postId))
        ]);
        
        setPost(postData);
        setReplies(repliesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

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
                  <span>{formatViewCount(post.likeCount)}</span>
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
              <div className="text-gray-300 leading-relaxed space-y-4">
                {post.content.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>


          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardHeader>
            <h3 className="text-xl font-bold text-white">댓글 {replies.length}개</h3>
          </CardHeader>
          <CardContent>
            {/* Comment Input */}
            <div className="mb-6">
              <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500/30 to-blue-500/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-300 mb-2">나의 클론으로 댓글 작성</p>
                  </div>
                </div>
                <textarea
                  placeholder="댓글을 작성해주세요..."
                  className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none"
                  rows={3}
                />
                <div className="flex justify-end mt-3">
                  <Button className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    댓글 작성
                  </Button>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-6">
              {replies.length > 0 ? (
                replies.map((reply) => (
                  <div key={reply.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-white">{reply.author}</span>
                          <span className="text-xs text-gray-400">{formatDate(reply.createdAt)}</span>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{reply.content}</p>
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
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
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
    </Layout>
  );
}

export default PostDetailPage; 