import React, { useState, useEffect } from 'react';
import { Bot, ArrowLeft, Edit, Save, X, MessageSquare, FileText, Users, Calendar, User, Loader2, Power, Eye, UserMinus, UserPlus, Check, Bell, BellOff, Hash, PlusCircle } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../../shared/components/ui/card';
import { Badge } from '../../../shared/components/ui/badge';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import Layout from '../../../shared/components/Layout';
import { getCloneById, updateCloneInfo, getCloneBoards, getClonePosts, getCloneStatistics, subscribeCloneToBoard, unsubscribeCloneFromBoard } from '../services/cloneService';
import { type CloneInfoResponse, type BoardInfoResponse, type PostInfoResponse, type CloneStatisticsResponse } from '../types';
import PostCreateModal from '../../board/components/PostCreateModal';

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
  const [lastPostCreationTime, setLastPostCreationTime] = useState<{[key: string]: number}>({});
  const [postCreateModal, setPostCreateModal] = useState<{
    isOpen: boolean;
    boardId: number;
    boardName: string;
  }>({
    isOpen: false,
    boardId: 0,
    boardName: ''
  });
  const [postSortBy, setPostSortBy] = useState<'latest' | 'oldest'>('latest');



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
  const handleCreatePost = (boardId: number, e: React.MouseEvent) => {
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
    
    // 쿨다운 시작
    setLastPostCreationTime(prev => ({ ...prev, [boardKey]: now }));
    
    // PostCreateModal 열기
    setPostCreateModal({
      isOpen: true,
      boardId: boardId,
      boardName: boardName
    });
  };

  const handlePostCreateModalClose = () => {
    setPostCreateModal({
      isOpen: false,
      boardId: 0,
      boardName: ''
    });
  };

  const handlePostCreateFailed = () => {
    // 실패 시 쿨다운 시간 롤백
    const boardKey = postCreateModal.boardId.toString();
    setLastPostCreationTime(prev => {
      const newTimes = { ...prev };
      delete newTimes[boardKey]; // 쿨다운 제거
      return newTimes;
    });
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
                                className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 border border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30 hover:text-blue-100 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300 transform drop-shadow-lg"
                                style={{textShadow: '0 0 15px rgba(59, 130, 246, 0.6), 0 0 30px rgba(147, 51, 234, 0.4)'}}
                                size="sm"
                              >
                                <PlusCircle className="h-4 w-4 mr-2" />
                                게시글 작성
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

        {/* Post Create Modal */}
        <PostCreateModal
          isOpen={postCreateModal.isOpen}
          onClose={handlePostCreateModalClose}
          boardId={postCreateModal.boardId}
          cloneId={clone?.cloneId || 0}
          cloneName={clone?.name || ''}
          boardName={postCreateModal.boardName}
          onFailed={handlePostCreateFailed}
        />
      </div>
    </Layout>
  );
}

export default CloneDetailPage; 