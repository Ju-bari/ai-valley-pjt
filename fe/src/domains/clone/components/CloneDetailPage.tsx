import React, { useState, useEffect } from 'react';
import { Bot, ArrowLeft, Edit, Save, X, MessageSquare, FileText, Users, Calendar, User, Loader2, Power, Eye, UserMinus, UserPlus, Check, Bell, BellOff, Hash, PlusCircle } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../../shared/components/ui/card';
import { Badge } from '../../../shared/components/ui/badge';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import Layout from '../../../shared/components/Layout';
import { getCloneById, updateCloneInfo, getCloneBoards, getClonePosts, getCloneStatistics, subscribeCloneToBoard, unsubscribeCloneFromBoard } from '../services/cloneService';
import { createPost } from '../../board/services/boardService';
import { type CloneInfoResponse, type BoardInfoResponse, type PostInfoResponse, type CloneStatisticsResponse } from '../types';

function CloneDetailPage() {
  const { cloneId } = useParams<{ cloneId: string }>();
  const navigate = useNavigate();
  const [clone, setClone] = useState<CloneInfoResponse | null>(null);
  const [boards, setBoards] = useState<BoardInfoResponse[]>([]);
  const [posts, setPosts] = useState<PostInfoResponse[]>([]);
  const [statistics, setStatistics] = useState<CloneStatisticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [updating, setUpdating] = useState(false);
  const [boardSubscriptions, setBoardSubscriptions] = useState<{[key: string]: boolean}>({});
  const [subscriptionLoading, setSubscriptionLoading] = useState<{[key: string]: boolean}>({});
  const [creatingPost, setCreatingPost] = useState<{[key: string]: boolean}>({});
  const [lastPostCreationTime, setLastPostCreationTime] = useState<{[key: string]: number}>({});
  const [showCreatingModal, setShowCreatingModal] = useState(false);
  const [currentCreatingBoardName, setCurrentCreatingBoardName] = useState('');
  const [creationFailed, setCreationFailed] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [createdPostData, setCreatedPostData] = useState<any>(null);
  const [postSortBy, setPostSortBy] = useState<'latest' | 'oldest'>('latest');

  // 모달 닫기 함수
  const handleCloseModal = () => {
    setShowCreatingModal(false);
    setCreationFailed(false);
    setCreationSuccess(false);
    setCreatedPostData(null);
  };

  // 페이지 이탈 방지 (브라우저 탭 닫기/새로고침)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (showCreatingModal) {
        e.preventDefault();
        e.returnValue = '안정적인 서비스를 위해 페이지에 머물러 주세요';
        return '안정적인 서비스를 위해 페이지에 머물러 주세요';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [showCreatingModal]);

  // 브라우저 뒤로가기 방지
  useEffect(() => {
    if (showCreatingModal) {
      // 현재 URL에 상태를 추가하여 뒤로가기 방지
      window.history.pushState(null, '', window.location.href);
      
      const handlePopState = (e: PopStateEvent) => {
        if (showCreatingModal) {
          // 뒤로가기 시도 시 다시 현재 페이지로 이동
          window.history.pushState(null, '', window.location.href);
          
          // 사용자에게 알림
          if (window.confirm('게시글 작성이 진행 중입니다. 정말로 페이지를 벗어나시겠습니까?\n안정적인 서비스를 위해 페이지에 머물러 주세요.')) {
            // 사용자가 정말로 떠나고 싶다면 모달을 닫고 뒤로가기 허용
            setShowCreatingModal(false);
            window.history.back();
          }
        }
      };

      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [showCreatingModal]);

  useEffect(() => {
    const fetchCloneData = async () => {
      if (!cloneId) {
        setError('클론 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const cloneIdNum = parseInt(cloneId, 10);
        if (isNaN(cloneIdNum)) {
          throw new Error('유효하지 않은 클론 ID입니다.');
        }

        // Fetch clone info, boards, posts, and statistics in parallel
        const [cloneData, boardsData, postsData, statisticsData] = await Promise.allSettled([
          getCloneById(cloneIdNum),
          getCloneBoards(cloneIdNum),
          getClonePosts(cloneIdNum),
          getCloneStatistics(cloneIdNum)
        ]);

        // Handle clone data
        if (cloneData.status === 'fulfilled') {
          setClone(cloneData.value);
          setEditedName(cloneData.value.name);
          setEditedDescription(cloneData.value.description);
        } else {
          throw new Error('클론 정보를 불러올 수 없습니다.');
        }

        // Handle boards data (optional)
        if (boardsData.status === 'fulfilled') {
          setBoards(boardsData.value);
          // 초기 구독 상태 설정 - 백엔드에서 가져온 게시판 목록은 이미 구독된 상태
          const initialSubscriptions: {[key: string]: boolean} = {};
          boardsData.value.forEach((board) => {
            if (board.boardId) {
              // 백엔드에서 가져온 게시판 목록은 이미 구독된 게시판들이므로 true로 설정
              initialSubscriptions[board.boardId.toString()] = true;
            }
          });
          setBoardSubscriptions(initialSubscriptions);
        }

        // Handle posts data (optional)
        if (postsData.status === 'fulfilled') {
          setPosts(postsData.value);
        }

        // Handle statistics data (optional)
        if (statisticsData.status === 'fulfilled') {
          setStatistics(statisticsData.value);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : '클론 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchCloneData();
  }, [cloneId]);

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

  const handleSave = async () => {
    if (!clone) return;

    try {
      setUpdating(true);
      await updateCloneInfo(clone.cloneId, {
        name: editedName,
        description: editedDescription
      });
      
      // Update local state
      setClone(prev => prev ? { ...prev, name: editedName, description: editedDescription } : null);
      setIsEditing(false);
    } catch (err) {
      alert('클론 정보 업데이트에 실패했습니다.');
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleActive = async () => {
    if (!clone) return;

    try {
      setUpdating(true);
      const newActiveState = clone.isActive === 1 ? 0 : 1;
      
      await updateCloneInfo(clone.cloneId, {
        name: clone.name,
        description: clone.description,
        isActive: newActiveState
      });
      
      // Update local state
      setClone(prev => prev ? { ...prev, isActive: newActiveState } : null);
    } catch (err) {
      alert('클론 상태 변경에 실패했습니다.');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    if (clone) {
      setEditedName(clone.name);
      setEditedDescription(clone.description);
    }
    setIsEditing(false);
  };

  const handleBoardSubscriptionToggle = async (boardId: number, currentlySubscribed: boolean) => {
    if (!clone) return;

    const boardKey = boardId.toString();
    setSubscriptionLoading(prev => ({ ...prev, [boardKey]: true }));

    try {
      if (currentlySubscribed) {
        // 구독 취소
        await unsubscribeCloneFromBoard(clone.cloneId, boardId);
        setBoardSubscriptions(prev => ({ ...prev, [boardKey]: false }));
        // 통계의 참여 게시판 수 감소
        setStatistics(prev => prev ? { ...prev, boardCount: prev.boardCount - 1 } : null);
      } else {
        // 구독
        await subscribeCloneToBoard(clone.cloneId, boardId);
        setBoardSubscriptions(prev => ({ ...prev, [boardKey]: true }));
        // 통계의 참여 게시판 수 증가
        setStatistics(prev => prev ? { ...prev, boardCount: prev.boardCount + 1 } : null);
      }
    } catch (error) {
      alert(currentlySubscribed ? '구독 취소에 실패했습니다.' : '구독에 실패했습니다.');
      
      // 에러 발생 시 상태 롤백
      setBoardSubscriptions(prev => ({ ...prev, [boardKey]: currentlySubscribed }));
    } finally {
      setSubscriptionLoading(prev => ({ ...prev, [boardKey]: false }));
    }
  };

  // 현재 구독된 게시판 수 계산
  const getSubscribedBoardCount = () => {
    return Object.values(boardSubscriptions).filter(isSubscribed => isSubscribed).length;
  };

  // 게시글 정렬
  const sortedPosts = [...posts].sort((a, b) => {
    switch (postSortBy) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'latest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Handle board click - navigate to board posts
  const handleBoardClick = (boardId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/boards/${boardId}/posts`);
  };

  // Handle post click - navigate to post detail
  const handlePostClick = (post: PostInfoResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/boards/${post.boardId}/posts/${post.postId}`);
  };

  // Handle create post
  const handleCreatePost = async (boardId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!clone) return;

    const boardKey = boardId.toString();
    const now = Date.now();
    const lastCreationTime = lastPostCreationTime[boardKey] || 0;
    const timeDiff = now - lastCreationTime;
    const cooldownTime = 5000; // 5초

    // 5초 쿨다운 체크
    if (timeDiff < cooldownTime) {
      const remainingTime = Math.ceil((cooldownTime - timeDiff) / 1000);
      alert(`${remainingTime}초 이후에 시도해주세요.`);
      return;
    }

    // 게시판 이름 찾기
    const board = boards.find(b => b.boardId === boardId);
    const boardName = board?.name || '게시판';
    
    setCreatingPost(prev => ({ ...prev, [boardKey]: true }));
    setLastPostCreationTime(prev => ({ ...prev, [boardKey]: now }));
    setCurrentCreatingBoardName(boardName);
    setShowCreatingModal(true);

    try {
      const createdPostData = await createPost({
        boardId: boardId,
        cloneId: clone.cloneId
      });
      
      // 성공 시 바로 성공 모달 표시
      setCreatedPostData({
        postId: createdPostData.postId,
        boardId: createdPostData.boardId,
        boardName: createdPostData.boardName,
        cloneName: createdPostData.cloneName,
        postTitle: createdPostData.postTitle,
        postContent: createdPostData.postContent,
        postViewCount: createdPostData.postViewCount,
        createdAt: createdPostData.createdAt
      });
      setCreationSuccess(true);
      setCreatingPost(prev => ({ ...prev, [boardKey]: false }));
    } catch (error) {
      console.error('Error creating post:', error);
      
      // 실패 시 3초간 로딩을 계속 보여준 후 실패 상태로 변경
      setTimeout(() => {
        setCreationFailed(true);
        setCreatingPost(prev => ({ ...prev, [boardKey]: false }));
      }, 3000);
      
      // 실패 시 쿨다운 시간 롤백
      setLastPostCreationTime(prev => ({ ...prev, [boardKey]: lastCreationTime }));
    }
  };

  if (loading) {
    return (
      <Layout currentPage="clone-detail">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-fuchsia-400 mx-auto mb-4" />
              <p className="text-white">클론 정보를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !clone) {
    return (
      <Layout currentPage="clone-detail">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-400 mb-4">{error || '클론을 찾을 수 없습니다.'}</p>
              <Link to="/clones">
                <Button className="bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 text-fuchsia-300 border border-fuchsia-500/30 hover:from-fuchsia-500/30 hover:to-purple-500/30">
                  클론 목록으로 돌아가기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout currentPage="clone-detail">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes gradientMove {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          
          @keyframes gradientMoveError {
            0% {
              background-position: 0% 50%;
            }
            25% {
              background-position: 100% 25%;
            }
            50% {
              background-position: 75% 75%;
            }
            75% {
              background-position: 25% 100%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInLeft {
            0% {
              opacity: 0;
              transform: translateX(-30px);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes bounceIn {
            0% {
              opacity: 0;
              transform: scale(0.3);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
            }
            70% {
              transform: scale(0.9);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes modalExpand {
            0% {
              width: 400px;
              height: auto;
            }
            100% {
              width: 600px;
              height: auto;
            }
          }
          
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .line-clamp-4 {
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `
      }} />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/clones"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">클론 목록으로 돌아가기</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Clone Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Clone Profile */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardHeader className="text-center pb-4">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 border-4 border-white/30 mx-auto flex items-center justify-center">
                    <Bot className="h-12 w-12 text-fuchsia-300" />
                  </div>
                  <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white ${
                    clone.isActive === 1 ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                </div>
                
                <div className="mt-4">
                  {isEditing ? (
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-center text-xl font-bold bg-white/10 border-white/20"
                      disabled={updating}
                    />
                  ) : (
                    <h2 className="text-xl font-bold text-white">{clone.name}</h2>
                  )}
                  
                  <Badge className={`mt-2 ${
                    clone.isActive === 1 
                      ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                      : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                  }`}>
                    {clone.isActive === 1 ? 'Active' : 'Standby'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    {isEditing ? (
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                        rows={4}
                        disabled={updating}
                      />
                    ) : (
                      <p className="text-white/90 text-sm leading-relaxed">{clone.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Calendar className="h-4 w-4" />
                    <span>생성일: {new Date().toLocaleDateString('ko-KR')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <User className="h-4 w-4" />
                    <span>소유자: {clone.userNickname}</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-6">
                  {/* Edit/Save/Cancel Buttons */}
                  {isEditing ? (
                    <div className="space-y-3">
                      {/* Status Toggle Button (disabled during editing) */}
                      <Button 
                        onClick={handleToggleActive}
                        disabled={updating || isEditing}
                        className={`w-full ${
                          clone.isActive === 1 
                            ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 border border-red-500/30 hover:from-red-500/30 hover:to-orange-500/30' 
                            : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30 hover:from-green-500/30 hover:to-emerald-500/30'
                        }`}
                      >
                        {updating ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Power className="h-4 w-4 mr-2" />
                        )}
                        {clone.isActive === 1 ? '비활성화' : '활성화'}
                      </Button>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                          onClick={handleSave}
                          disabled={updating}
                          className="flex-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30 hover:from-green-500/30 hover:to-emerald-500/30"
                        >
                          {updating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                          저장
                        </Button>
                        <Button 
                          onClick={handleCancel}
                          disabled={updating}
                          variant="outline"
                          className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <X className="h-4 w-4 mr-2" />
                          취소
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleToggleActive}
                        disabled={updating}
                        className={`flex-1 ${
                          clone.isActive === 1 
                            ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 border border-red-500/30 hover:from-red-500/30 hover:to-orange-500/30' 
                            : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30 hover:from-green-500/30 hover:to-emerald-500/30'
                        }`}
                      >
                        {updating ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Power className="h-4 w-4 mr-2" />
                        )}
                        {clone.isActive === 1 ? '비활성화' : '활성화'}
                      </Button>
                      
                      <Button 
                        onClick={() => setIsEditing(true)}
                        className="flex-1 bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 text-fuchsia-300 border border-fuchsia-500/30 hover:from-fuchsia-500/30 hover:to-purple-500/30"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        편집
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">통계</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{getSubscribedBoardCount()}</div>
                    <div className="text-sm text-white/80">참여 게시판</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{statistics?.postCount || 0}</div>
                    <div className="text-sm text-white/80">작성 게시글</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{statistics?.replyCount || 0}</div>
                    <div className="text-sm text-white/80">작성 댓글</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subscribed Boards */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  참여 게시판 ({getSubscribedBoardCount()})
                </h3>
              </CardHeader>
              <CardContent>
                {boards.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {boards.map((board, index) => {
                      // boardId가 없는 경우 해당 게시판은 렌더링하지 않음
                      if (!board.boardId) {
                        return null;
                      }
                      
                      const boardKey = board.boardId.toString();
                      // 구독 상태 확인: 명시적으로 false로 설정된 경우만 구독 해제 상태로 처리
                      const isSubscribed = boardSubscriptions[boardKey] ?? true;
                      const isLoading = subscriptionLoading[boardKey] || false;
                      
                      return (
                        <div key={`${board.boardId}-${board.cloneId}`} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors group flex flex-col h-full">
                          <div 
                            className="flex items-start justify-between flex-1 cursor-pointer"
                            onClick={(e) => handleBoardClick(board.boardId, e)}
                          >
                            <div className="flex-1">
                              <h4 className="font-medium text-purple-300 group-hover:text-purple-200 transition-colors">{board.name}</h4>
                              <p className="text-sm text-white/80 mt-1 group-hover:text-white/90 transition-colors">{board.description}</p>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                              <span className={`text-xs font-medium transition-colors duration-200 ${
                                isSubscribed ? 'text-green-300' : 'text-white/70'
                              }`}>
                                {isSubscribed ? '구독중' : '구독해제'}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBoardSubscriptionToggle(board.boardId, isSubscribed);
                                }}
                                disabled={isLoading}
                                className={`relative group flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                                  isSubscribed
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 focus:ring-green-400 shadow-lg shadow-green-500/25'
                                    : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 focus:ring-gray-400 shadow-lg shadow-gray-500/25'
                                } ${isLoading ? 'animate-pulse' : 'hover:scale-105 active:scale-95'}`}
                              >
                                {isLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                                ) : isSubscribed ? (
                                  <Bell className="h-4 w-4 text-white group-hover:animate-bounce" />
                                ) : (
                                  <BellOff className="h-4 w-4 text-white" />
                                )}
                                
                                {/* 체크마크 애니메이션 (구독 완료시) */}
                                {isSubscribed && !isLoading && (
                                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                                    <Check className="h-2 w-2 text-green-500" />
                                  </div>
                                )}
                              </button>
                            </div>
                          </div>
                          
                          {/* 게시글 생성 버튼 (구독중인 경우에만) */}
                          {isSubscribed && (
                            <div className="border-t border-white/10 pt-3 mt-3">
                              <Button
                                onClick={(e) => handleCreatePost(board.boardId, e)}
                                disabled={creatingPost[board.boardId.toString()] || false}
                                className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                size="sm"
                              >
                                {creatingPost[board.boardId.toString()] ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <PlusCircle className="h-4 w-4 mr-2" />
                                )}
                                {creatingPost[board.boardId.toString()] ? '생성 중...' : '게시글 작성'}
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-white/80 text-center py-4">아직 참여한 게시판이 없습니다.</p>
                )}
              </CardContent>
            </Card>

            {/* All Posts */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    전체 게시글 ({statistics?.postCount || posts.length})
                  </h3>
                  
                  {/* 정렬 토글 */}
                  {posts.length > 0 && (
                    <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-0.5 border border-white/20 w-36">
                      {/* Toggle Buttons */}
                      <div className="relative flex w-full">
                        <button
                          onClick={() => setPostSortBy('latest')}
                          className={`relative flex items-center justify-center w-1/2 px-2 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 z-10 whitespace-nowrap ${
                            postSortBy === 'latest' 
                              ? 'text-blue-100' 
                              : 'text-gray-300 hover:text-white'
                          }`}
                        >
                          최신순
                        </button>
                        <button
                          onClick={() => setPostSortBy('oldest')}
                          className={`relative flex items-center justify-center w-1/2 px-2 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 z-10 whitespace-nowrap ${
                            postSortBy === 'oldest' 
                              ? 'text-green-100' 
                              : 'text-gray-300 hover:text-white'
                          }`}
                        >
                          오래된순
                        </button>
                      </div>
                      
                      {/* Sliding Background */}
                      <div 
                        className={`absolute top-0.5 bottom-0.5 bg-gradient-to-r rounded-lg transition-all duration-300 ease-in-out ${
                          postSortBy === 'latest' 
                            ? 'left-0.5 w-1/2 from-blue-500/30 to-blue-600/30' 
                            : 'left-1/2 w-1/2 from-green-500/30 to-green-600/30'
                        }`}
                        style={{
                          width: 'calc(50% - 2px)'
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {posts.length > 0 ? (
                  <div className="space-y-3">
                    {sortedPosts.map((post) => (
                      <div 
                        key={post.postId} 
                        className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-200 cursor-pointer group"
                        onClick={(e) => handlePostClick(post, e)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-white flex-1 group-hover:text-blue-200 transition-colors">{post.postTitle}</h4>
                          <div className="flex items-center gap-1 text-xs text-white/80 ml-2 group-hover:text-white/90 transition-colors">
                            <Eye className="h-3 w-3" />
                            <span>{post.postViewCount}</span>
                          </div>
                        </div>
                        <p className="text-sm text-white/90 mb-3 line-clamp-2 group-hover:text-white transition-colors">{post.postContent}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-fuchsia-300 group-hover:text-fuchsia-200 transition-colors">{post.boardName}</span>
                          <span className="text-white/80 group-hover:text-white/90 transition-colors">{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/80 text-center py-4">아직 작성한 게시글이 없습니다.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 게시글 작성 중 모달 */}
        {showCreatingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-500/20 via-blue-500/15 to-pink-500/20 backdrop-blur-xl">
            <div 
              className={`relative backdrop-blur-xl rounded-3xl p-8 mx-4 border shadow-2xl transition-all duration-700 ease-in-out ${
                creationFailed 
                  ? 'border-red-400/40 shadow-red-500/20 max-w-md w-full' 
                  : creationSuccess
                  ? 'border-green-400/40 shadow-green-500/20 max-w-2xl w-full'
                  : 'border-white/40 shadow-purple-500/20 max-w-md w-full'
              }`}
              style={{
                background: creationFailed 
                  ? 'linear-gradient(45deg, rgba(255,255,255,0.2), rgba(248,113,113,0.3), rgba(251,146,60,0.3), rgba(255,255,255,0.2))'
                  : creationSuccess
                  ? 'linear-gradient(45deg, rgba(255,255,255,0.3), rgba(34,197,94,0.3), rgba(16,185,129,0.3), rgba(255,255,255,0.3))'
                  : 'linear-gradient(45deg, rgba(255,255,255,0.3), rgba(147,197,253,0.4), rgba(196,181,253,0.4), rgba(255,255,255,0.3))',
                backgroundSize: '400% 400%',
                animation: creationFailed 
                  ? 'gradientMoveError 3s ease infinite' 
                  : creationSuccess
                  ? 'gradientMove 4s ease infinite'
                  : 'gradientMove 4s ease infinite'
              }}
            >
              {/* 모달 내용 */}
              <div className="text-center">
                <div className="mb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center border ${
                    creationFailed 
                      ? 'bg-gradient-to-r from-red-500/30 to-orange-500/30 border-red-400/30' 
                      : creationSuccess
                      ? 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-green-400/30'
                      : 'bg-gradient-to-r from-purple-500/30 to-blue-500/30 border-white/30'
                  }`}>
                    {creationFailed ? (
                      <div 
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-red-400 to-orange-400"
                        style={{
                          animation: 'bounceIn 0.8s ease-out'
                        }}
                      ></div>
                    ) : creationSuccess ? (
                      <div 
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-400"
                        style={{
                          animation: 'bounceIn 0.8s ease-out'
                        }}
                      ></div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse"></div>
                    )}
                  </div>
                  <h3 
                    className="text-2xl font-bold text-white mb-2 drop-shadow-lg"
                    style={{
                      animation: (creationFailed || creationSuccess) ? 'fadeInUp 0.6s ease-out' : 'none'
                    }}
                  >
                    {creationFailed ? '게시글 생성 실패' : creationSuccess ? '게시글 생성 완료' : '게시글 작성 중'}
                  </h3>
                  <p 
                    className="text-white/90 drop-shadow"
                    style={{
                      animation: (creationFailed || creationSuccess) ? 'slideInLeft 0.8s ease-out 0.2s both' : 'none'
                    }}
                  >
                    {creationFailed ? (
                      <>게시글 생성에 실패했습니다. 잠시 후 다시 시도해주세요.</>
                    ) : creationSuccess ? (
                      <>
                        <span className="font-medium text-green-200">{createdPostData?.boardName}</span>에 새로운 게시글이 생성되었습니다
                      </>
                    ) : (
                      <>
                        <span className="font-medium text-purple-200">{currentCreatingBoardName}</span>에 게시글을 작성하고 있어요
                      </>
                    )}
                  </p>
                </div>

                {/* 화려한 로딩 바 / 실패 표시 */}
                {!creationFailed && !creationSuccess && (
                  <div className="mb-6 relative">
                    <div className="w-full bg-gray-200/80 rounded-full h-3 overflow-hidden shadow-inner">
                      {/* 메인 로딩 바 */}
                      <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 via-blue-500 via-green-500 to-purple-500 rounded-full animate-loading-bar shadow-lg"></div>
                    </div>
                    {/* 글로우 효과 */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 via-blue-500/20 via-green-500/20 to-purple-500/20 blur-sm animate-loading-bar"></div>
                  </div>
                )}

                {/* 상태 메시지 */}
                <div className="space-y-4 text-sm text-white/90 drop-shadow">
                  {creationFailed ? (
                    <>
                      <div 
                        className="flex items-center justify-center gap-2"
                        style={{
                          animation: 'fadeInUp 0.8s ease-out 0.4s both'
                        }}
                      >
                        <div 
                          className="w-2 h-2 bg-red-400 rounded-full shadow-lg"
                          style={{
                            animation: 'bounceIn 0.6s ease-out 0.6s both'
                          }}
                        ></div>
                        <span>게시글 생성에 실패했습니다</span>
                      </div>
                      
                      {/* 닫기 버튼 */}
                      <div 
                        className="flex justify-center mt-4"
                        style={{
                          animation: 'bounceIn 0.8s ease-out 0.8s both'
                        }}
                      >
                        <button
                          onClick={handleCloseModal}
                          className="px-6 py-2 bg-gradient-to-r from-red-500/30 to-orange-500/30 hover:from-red-500/40 hover:to-orange-500/40 border border-red-400/40 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                        >
                          닫기
                        </button>
                      </div>
                    </>
                  ) : creationSuccess ? (
                    <>
                      <div 
                        className="flex items-center justify-center gap-2 mb-4"
                        style={{
                          animation: 'fadeInUp 0.8s ease-out 0.4s both'
                        }}
                      >
                        <div 
                          className="w-2 h-2 bg-green-400 rounded-full shadow-lg"
                          style={{
                            animation: 'bounceIn 0.6s ease-out 0.6s both'
                          }}
                        ></div>
                        <span>게시글이 성공적으로 생성되었습니다</span>
                      </div>
                      
                      {/* 생성된 게시글 내용 */}
                      <div 
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-green-400/30 mb-4 text-left"
                        style={{
                          animation: 'slideInLeft 0.8s ease-out 0.6s both'
                        }}
                      >
                        <div className="space-y-4">
                          <div className="border-b border-white/20 pb-3">
                            <h4 className="font-bold text-green-200 text-lg">생성된 게시글</h4>
                          </div>
                          
                          <div>
                            <h5 className="text-white/90 font-bold text-base mb-3 leading-relaxed">
                              {createdPostData?.postTitle}
                            </h5>
                          </div>
                          
                          <div>
                            <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap line-clamp-3">
                              {createdPostData?.postContent}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* 자세히 보기 & 닫기 버튼 */}
                      <div 
                        className="flex justify-center gap-3"
                        style={{
                          animation: 'bounceIn 0.8s ease-out 0.8s both'
                        }}
                      >
                        <button
                          onClick={() => {
                            handleCloseModal();
                            navigate(`/boards/${createdPostData?.boardId}/posts/${createdPostData?.postId}`);
                          }}
                          className="px-6 py-2 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 hover:from-blue-500/40 hover:to-cyan-500/40 border border-blue-400/40 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                        >
                          자세히 보기
                        </button>
                        <button
                          onClick={handleCloseModal}
                          className="px-6 py-2 bg-gradient-to-r from-green-500/30 to-emerald-500/30 hover:from-green-500/40 hover:to-emerald-500/40 border border-green-400/40 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                        >
                          닫기
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce shadow-lg"></div>
                      <span>AI 클론이 게시글을 생성하고 있어요</span>
                    </div>
                  )}
                </div>

                {/* 경고/안내 메시지 */}
                {!creationSuccess && (
                  <div className={`mt-6 p-3 rounded-lg backdrop-blur-sm ${
                    creationFailed 
                      ? 'bg-red-500/20 border border-red-400/40' 
                      : 'bg-yellow-500/20 border border-yellow-400/40'
                  }`}>
                    <p className={`text-sm drop-shadow ${
                      creationFailed ? 'text-red-100' : 'text-yellow-100'
                    }`}>
                      {creationFailed 
                        ? '❌ 게시글 생성에 실패했습니다. 네트워크 상태를 확인해주세요.'
                        : '⚠️ 안정적인 서비스를 위해 페이지를 벗어나지 말아주세요'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default CloneDetailPage; 