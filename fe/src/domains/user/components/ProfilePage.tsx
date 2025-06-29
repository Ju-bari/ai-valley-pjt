import { Bot, ArrowLeft, Edit, Save, X, User, Mail, Calendar, Camera, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../../shared/components/ui/card';
import { Badge } from '../../../shared/components/ui/badge';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { useState, useEffect } from 'react';
import Layout from '../../../shared/components/Layout';
import { getCompleteUserData, updateUserInfo } from '../services/userService';
import { type UserData } from '../types';
import { ApiException } from '../../../shared/utils/api';

function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userData = await getCompleteUserData();
        
        setUserData(userData);
        setEditedName(userData.name);
      } catch (err) {
        const errorMessage = err instanceof ApiException 
          ? `${err.message}${err.commonStatus ? ` (${err.commonStatus})` : ''}` 
          : err instanceof Error 
            ? err.message 
            : '사용자 정보를 불러오는데 실패했습니다.';
            
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);

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

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Validate nickname based on backend logic
  const validateNickname = (nickname: string): string | null => {
    if (!nickname || nickname.trim().length === 0) {
      return '닉네임은 비어있을 수 없습니다.';
    }
    if (nickname.length < 2 || nickname.length > 10) {
      return '닉네임은 2자 이상 10자 이하로 입력해주세요.';
    }
    return null;
  };

  // Handle nickname input change with validation
  const handleNicknameChange = (value: string) => {
    setEditedName(value);
    const error = validateNickname(value);
    setValidationError(error);
  };

  const handleSave = async () => {
    if (!userData) return;
    
    // Client-side validation
    const validationErr = validateNickname(editedName);
    if (validationErr) {
      setValidationError(validationErr);
      return;
    }

    // Check if nickname actually changed
    if (editedName.trim() === userData.name) {
      setIsEditing(false);
      return;
    }
    
    try {
      setIsUpdating(true);
      setValidationError(null);
      
      const result = await updateUserInfo({ nickname: editedName.trim() });
      
      // Backend returns 1 for successful update
      if (result === 1) {
        // Update local state
        setUserData({
          ...userData,
          name: editedName.trim()
        });
        
        setIsEditing(false);
        setUpdateSuccess(true);
      } else {
        throw new Error('업데이트에 실패했습니다.');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiException 
        ? `${err.message}${err.commonStatus ? ` (${err.commonStatus})` : ''}` 
        : err instanceof Error
          ? err.message
          : '프로필 업데이트에 실패했습니다.';
        
      setValidationError(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    if (userData) {
      setEditedName(userData.name);
    }
    setValidationError(null);
    setIsEditing(false);
  };

  const handleEditStart = () => {
    setValidationError(null);
    setUpdateSuccess(false);
    setIsEditing(true);
  };

  if (loading) {
    return (
      <Layout currentPage="profile">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link 
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">홈으로 돌아가기</span>
            </Link>
          </div>
          
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-white/20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray-400">사용자 정보를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !userData) {
    return (
      <Layout currentPage="profile">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link 
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">홈으로 돌아가기</span>
            </Link>
          </div>
          
          <div className="text-center py-12">
            <div className="bg-red-500/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-red-500/20">
              <User className="h-12 w-12 mx-auto mb-4 text-red-400" />
              <h3 className="text-xl font-semibold text-white mb-2">오류가 발생했습니다</h3>
              <p className="text-red-300 mb-4">{error || '사용자 정보를 불러올 수 없습니다.'}</p>
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

  return (
    <Layout currentPage="profile">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">홈으로 돌아가기</span>
          </Link>
        </div>

        {/* Success Message */}
        {updateSuccess && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm">
            <p className="text-green-300 text-center">프로필이 성공적으로 업데이트되었습니다! ✨</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                <CardHeader className="text-center pb-4">
                  <div className="relative inline-block">
                    {userData.avatar ? (
                      <img
                        src={userData.avatar}
                        alt={userData.name}
                        className="w-24 h-24 rounded-3xl object-cover border-4 border-white/30 mx-auto"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 border-4 border-white/30 mx-auto flex items-center justify-center">
                        <User className="h-12 w-12 text-fuchsia-300" />
                      </div>
                    )}
                    {isEditing && (
                      <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-fuchsia-500 border-2 border-white flex items-center justify-center hover:bg-fuchsia-600 transition-colors shadow-lg">
                        <Camera className="h-4 w-4 text-white" />
                      </button>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          value={editedName}
                          onChange={(e) => handleNicknameChange(e.target.value)}
                          className={`text-center text-xl font-bold bg-white/10 border-white/20 ${
                            validationError ? 'border-red-500/50 focus:ring-red-400' : ''
                          }`}
                          placeholder="닉네임을 입력하세요"
                          maxLength={10}
                          disabled={isUpdating}
                        />
                        {validationError && (
                          <p className="text-red-400 text-sm text-center">{validationError}</p>
                        )}
                        <p className="text-white/60 text-xs text-center">
                          {editedName.length}/10자
                        </p>
                      </div>
                    ) : (
                      <h2 className="text-xl font-bold text-white">{userData.name}</h2>
                    )}
                    
                    <p className="text-white/80 text-sm mt-2">{userData.email}</p>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Calendar className="h-4 w-4" />
                      <span>가입일: {formatJoinDate(userData.joinDate)}</span>
                    </div>
                  </div>
                  
                  {/* Edit Controls */}
                  <div className="mt-6">
                    {isEditing ? (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button 
                          onClick={handleSave} 
                          disabled={!!validationError || isUpdating || editedName.trim() === userData.name}
                          className="flex-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30 hover:from-green-500/30 hover:to-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUpdating ? (
                            <>
                              <div className="w-4 h-4 border-2 border-green-300 border-t-transparent rounded-full animate-spin mr-2" />
                              저장 중...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              저장
                            </>
                          )}
                        </Button>
                        <Button 
                          onClick={handleCancel} 
                          disabled={isUpdating}
                          className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
                        >
                          <X className="h-4 w-4 mr-2" />
                          취소
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={handleEditStart} 
                        className="w-full bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 text-fuchsia-300 border border-fuchsia-500/30 hover:from-fuchsia-500/30 hover:to-purple-500/30"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        프로필 수정
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Activity Stats & Recent Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* Activity Stats Card */}
              <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                <CardHeader>
                  <h3 className="text-lg font-bold text-white">활동 통계</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <Link 
                      to="/clones"
                      className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                    >
                      <Bot className="h-6 w-6 text-blue-400 mx-auto mb-2 group-hover:text-blue-300 transition-colors" />
                      <div className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">{userData.totalClones}</div>
                      <div className="text-xs text-white/70">AI 클론</div>
                    </Link>
                    
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <FileText className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                      <div className="text-xl font-bold text-white">{userData.totalPosts}</div>
                      <div className="text-xs text-white/70">게시글</div>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <Mail className="h-6 w-6 text-green-400 mx-auto mb-2" />
                      <div className="text-xl font-bold text-white">{userData.totalComments}</div>
                      <div className="text-xs text-white/70">댓글</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                <CardHeader>
                  <h3 className="text-lg font-bold text-white">최근 활동</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData.recentActivity.map((activity) => (
                      <div key={activity.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        {activity.type === 'post' && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="h-4 w-4 text-purple-400" />
                              <span className="text-sm font-medium text-purple-300">새 게시글 작성</span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-400">{formatDate(activity.createdAt)}</span>
                            </div>
                            <p className="text-white font-medium mb-1">{activity.title}</p>
                            <p className="text-xs text-gray-400">{activity.boardName}</p>
                          </div>
                        )}
                        
                        {activity.type === 'comment' && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Mail className="h-4 w-4 text-green-400" />
                              <span className="text-sm font-medium text-green-300">댓글 작성</span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-400">{formatDate(activity.createdAt)}</span>
                            </div>
                            <p className="text-gray-300 text-sm mb-1">"{activity.content}"</p>
                            <p className="text-xs text-gray-400">게시글: {activity.postTitle} • {activity.boardName}</p>
                          </div>
                        )}
                        
                        {activity.type === 'clone' && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Bot className="h-4 w-4 text-blue-400" />
                              <span className="text-sm font-medium text-blue-300">새 클론 생성</span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-400">{formatDate(activity.createdAt)}</span>
                            </div>
                            <p className="text-white font-medium">{activity.cloneName}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

export default ProfilePage; 