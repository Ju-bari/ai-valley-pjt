import { Bot, ArrowLeft, Edit, Save, X, User, Mail, Calendar, Camera } from 'lucide-react';
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

        {/* Main Content Container */}
        <div className="max-w-6xl mx-auto">
          {/* Success Message */}
          {updateSuccess && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
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
                        className="w-32 h-32 rounded-3xl object-cover border-4 border-white mx-auto"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 border-4 border-white mx-auto flex items-center justify-center">
                        <User className="h-16 w-16 text-fuchsia-300" />
                      </div>
                    )}
                    {isEditing && (
                      <button className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-fuchsia-500 border-2 border-white flex items-center justify-center hover:bg-fuchsia-600 transition-colors shadow-lg">
                        <Camera className="h-5 w-5 text-white" />
                      </button>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          value={editedName}
                          onChange={(e) => handleNicknameChange(e.target.value)}
                          className={`text-center text-2xl font-bold bg-white/10 border-white/20 ${
                            validationError ? 'border-red-500/50 focus:ring-red-400' : ''
                          }`}
                          placeholder="닉네임을 입력하세요"
                          maxLength={10}
                          disabled={isUpdating}
                        />
                        {validationError && (
                          <p className="text-red-400 text-sm text-center">{validationError}</p>
                        )}
                        <p className="text-gray-500 text-xs text-center">
                          {editedName.length}/10자
                        </p>
                      </div>
                    ) : (
                      <h2 className="text-2xl font-bold text-white">{userData.name}</h2>
                    )}
                    
                    <p className="text-gray-400 text-sm mt-1">{userData.email}</p>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-gray-400">
                      <div className="flex items-center gap-2 justify-center">
                        <Calendar className="h-4 w-4" />
                        <span>가입일: {formatJoinDate(userData.joinDate)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Edit Controls */}
                  <div className="flex gap-2 mt-6">
                    {isEditing ? (
                      <>
                        <Button 
                          onClick={handleSave} 
                          disabled={!!validationError || isUpdating || editedName.trim() === userData.name}
                          className="flex-1 bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          variant="ghost" 
                          className="flex-1 bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30 disabled:opacity-50"
                        >
                          <X className="h-4 w-4 mr-2" />
                          취소
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={handleEditStart} 
                        className="w-full bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30 hover:bg-fuchsia-500/30"
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
                  <div className="space-y-4">
                    <Link 
                      to="/clones"
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <Bot className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                        <span className="text-white font-medium group-hover:text-blue-300 transition-colors">AI 클론</span>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 group-hover:bg-blue-500/30 transition-colors">
                        {userData.totalClones}개
                      </Badge>
                    </Link>
                    
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-purple-400" />
                        <span className="text-white font-medium">작성 게시글</span>
                      </div>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                        {userData.totalPosts}개
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-green-400" />
                        <span className="text-white font-medium">작성 댓글</span>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        {userData.totalComments}개
                      </Badge>
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
                              <User className="h-4 w-4 text-purple-400" />
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
      </div>
    </Layout>
  );
}

export default ProfilePage; 