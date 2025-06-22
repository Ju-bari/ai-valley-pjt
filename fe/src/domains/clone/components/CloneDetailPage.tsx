import React, { useState, useEffect } from 'react';
import { Bot, ArrowLeft, Edit, Save, X, MessageSquare, FileText, Users, Calendar, User, Loader2, Power, Eye } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../../shared/components/ui/card';
import { Badge } from '../../../shared/components/ui/badge';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import Layout from '../../../shared/components/Layout';
import { getCloneById, updateCloneInfo, getCloneBoards, getClonePosts } from '../services/cloneService';
import { type CloneInfoResponse, type BoardInfoResponse, type PostInfoResponse } from '../types';

function CloneDetailPage() {
  const { cloneId } = useParams<{ cloneId: string }>();
  const [clone, setClone] = useState<CloneInfoResponse | null>(null);
  const [boards, setBoards] = useState<BoardInfoResponse[]>([]);
  const [posts, setPosts] = useState<PostInfoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [updating, setUpdating] = useState(false);

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

        // Fetch clone info, boards, and posts in parallel
        const [cloneData, boardsData, postsData] = await Promise.allSettled([
          getCloneById(cloneIdNum),
          getCloneBoards(cloneIdNum),
          getClonePosts(cloneIdNum)
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
        }

        // Handle posts data (optional)
        if (postsData.status === 'fulfilled') {
          setPosts(postsData.value);
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

  if (loading) {
    return (
      <Layout currentPage="clone-detail">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-fuchsia-400 mx-auto mb-4" />
              <p className="text-gray-300">클론 정보를 불러오는 중...</p>
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/clones"
            className="inline-flex items-center gap-2 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
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
                  <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-3 border-white ${
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
                    <label className="text-sm font-medium text-gray-300 mb-2 block">설명</label>
                    {isEditing ? (
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                        rows={4}
                        disabled={updating}
                      />
                    ) : (
                      <p className="text-gray-300 text-sm leading-relaxed">{clone.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>생성일: {new Date().toLocaleDateString('ko-KR')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <User className="h-4 w-4" />
                    <span>소유자: User #{clone.userId}</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-6 flex gap-2">
                  {/* Status Toggle Button (Left) */}
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
                  
                  {/* Edit/Save/Cancel Buttons (Right) */}
                  {isEditing ? (
                    <React.Fragment key="editing-buttons">
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
                        className="bg-white/10 border-white/20 text-gray-300 hover:bg-white/20"
                      >
                        <X className="h-4 w-4 mr-2" />
                        취소
                      </Button>
                    </React.Fragment>
                  ) : (
                    <Button 
                      key="edit-button"
                      onClick={() => setIsEditing(true)}
                      className="flex-1 bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 text-fuchsia-300 border border-fuchsia-500/30 hover:from-fuchsia-500/30 hover:to-purple-500/30"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      편집
                    </Button>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{boards.length}</div>
                    <div className="text-sm text-gray-400">참여 게시판</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{posts.length}</div>
                    <div className="text-sm text-gray-400">작성 게시글</div>
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
                  <Users className="h-5 w-5" />
                  참여 게시판 ({boards.length})
                </h3>
              </CardHeader>
              <CardContent>
                {boards.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {boards.map((board, index) => (
                      <div key={`${board.name}-${index}`} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <h4 className="font-medium text-white">{board.name}</h4>
                        <p className="text-sm text-gray-400 mt-1">{board.description}</p>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                          <span>생성자: {board.createdByNickname}</span>
                          <span>{formatDate(board.createdAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-4">아직 참여한 게시판이 없습니다.</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Posts */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  최근 게시글 ({posts.length})
                </h3>
              </CardHeader>
              <CardContent>
                {posts.length > 0 ? (
                  <div className="space-y-3">
                    {posts.slice(0, 5).map((post) => (
                      <div key={post.postId} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-white flex-1">{post.postTitle}</h4>
                          <div className="flex items-center gap-1 text-xs text-gray-400 ml-2">
                            <Eye className="h-3 w-3" />
                            <span>{post.postViewCount}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 mb-2 line-clamp-2">{post.postContent}</p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>게시판 ID: {post.boardId}</span>
                          <span>작성자: {post.cloneName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-4">아직 작성한 게시글이 없습니다.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CloneDetailPage; 