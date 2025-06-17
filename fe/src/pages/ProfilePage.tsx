import { Bot, ArrowLeft, Edit, Save, X, User, Mail, Calendar, MapPin, Shield, Bell, Palette, Globe, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import Layout from '../components/Layout';

// Mock user data
const mockUser = {
  id: 1,
  name: "김지훈",
  email: "jihoon.kim@example.com",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  bio: "AI와 기술에 관심이 많은 개발자입니다. 새로운 기술을 배우고 공유하는 것을 좋아합니다.",
  location: "서울, 대한민국",
  joinDate: "2024-01-15T10:30:00Z",
  totalClones: 6,
  totalPosts: 234,
  totalComments: 567,
  preferences: {
    notifications: true,
    darkMode: true,
    language: "ko",
    privacy: "public"
  },
  recentActivity: [
    {
      id: 1,
      type: "post",
      title: "AI Valley 사용 후기",
      boardName: "AI 기술 토론",
      createdAt: "2024-06-17T14:30:00Z"
    },
    {
      id: 2,
      type: "comment",
      content: "정말 유용한 정보네요!",
      postTitle: "머신러닝 최적화 기법",
      boardName: "프로그래밍 Q&A",
      createdAt: "2024-06-17T11:20:00Z"
    },
    {
      id: 3,
      type: "clone",
      action: "created",
      cloneName: "Health Zeta",
      createdAt: "2024-06-16T09:15:00Z"
    }
  ]
};

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(mockUser.name);
  const [editedBio, setEditedBio] = useState(mockUser.bio);
  const [editedLocation, setEditedLocation] = useState(mockUser.location);

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

  const handleSave = () => {
    // Here you would typically save to API
    console.log('Saving profile:', { editedName, editedBio, editedLocation });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(mockUser.name);
    setEditedBio(mockUser.bio);
    setEditedLocation(mockUser.location);
    setIsEditing(false);
  };

  return (
    <Layout currentPage="profile">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">홈으로 돌아가기</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardHeader className="text-center pb-4">
                <div className="relative inline-block">
                  <img
                    src={mockUser.avatar}
                    alt={mockUser.name}
                    className="w-32 h-32 rounded-3xl object-cover border-4 border-white/30 mx-auto"
                  />
                  <button className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-fuchsia-500/80 backdrop-blur-sm border-2 border-white flex items-center justify-center hover:bg-fuchsia-500 transition-colors">
                    <Camera className="h-4 w-4 text-white" />
                  </button>
                </div>
                
                <div className="mt-4">
                  {isEditing ? (
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-center text-2xl font-bold bg-white/10 border-white/20"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-white">{mockUser.name}</h2>
                  )}
                  
                  <p className="text-gray-400 text-sm mt-1">{mockUser.email}</p>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">소개</label>
                    {isEditing ? (
                      <textarea
                        value={editedBio}
                        onChange={(e) => setEditedBio(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                        rows={4}
                      />
                    ) : (
                      <p className="text-gray-300 text-sm leading-relaxed">{mockUser.bio}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">위치</label>
                    {isEditing ? (
                      <Input
                        value={editedLocation}
                        onChange={(e) => setEditedLocation(e.target.value)}
                        className="bg-white/10 border-white/20"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{mockUser.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span>가입일: {formatJoinDate(mockUser.joinDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>인증된 사용자</span>
                    </div>
                  </div>
                </div>
                
                {/* Edit Controls */}
                <div className="flex gap-2 mt-6">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave} className="flex-1 bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30">
                        <Save className="h-4 w-4 mr-2" />
                        저장
                      </Button>
                      <Button onClick={handleCancel} variant="ghost" className="flex-1 bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30">
                        <X className="h-4 w-4 mr-2" />
                        취소
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} className="w-full bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30 hover:bg-fuchsia-500/30">
                      <Edit className="h-4 w-4 mr-2" />
                      프로필 수정
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardHeader>
                <h3 className="text-lg font-bold text-white">활동 통계</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3">
                      <Bot className="h-5 w-5 text-blue-400" />
                      <span className="text-white font-medium">AI 클론</span>
                    </div>
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {mockUser.totalClones}개
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-purple-400" />
                      <span className="text-white font-medium">작성 게시글</span>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {mockUser.totalPosts}개
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-green-400" />
                      <span className="text-white font-medium">작성 댓글</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      {mockUser.totalComments}개
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Settings & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Settings Card */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardHeader>
                <h3 className="text-lg font-bold text-white">설정</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-yellow-400" />
                        <span className="font-medium text-white">알림</span>
                      </div>
                      <div className={`w-10 h-6 rounded-full p-1 transition-colors ${
                        mockUser.preferences.notifications ? 'bg-green-500' : 'bg-gray-600'
                      }`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          mockUser.preferences.notifications ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">새로운 활동 알림 받기</p>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-purple-400" />
                        <span className="font-medium text-white">다크 모드</span>
                      </div>
                      <div className={`w-10 h-6 rounded-full p-1 transition-colors ${
                        mockUser.preferences.darkMode ? 'bg-purple-500' : 'bg-gray-600'
                      }`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          mockUser.preferences.darkMode ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">어두운 테마 사용</p>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4 text-blue-400" />
                      <span className="font-medium text-white">언어</span>
                    </div>
                    <select className="w-full bg-white/10 border border-white/20 rounded p-2 text-white text-sm">
                      <option value="ko">한국어</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-green-400" />
                      <span className="font-medium text-white">프라이버시</span>
                    </div>
                    <select className="w-full bg-white/10 border border-white/20 rounded p-2 text-white text-sm">
                      <option value="public">공개</option>
                      <option value="private">비공개</option>
                    </select>
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
                  {mockUser.recentActivity.map((activity) => (
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
    </Layout>
  );
}

export default ProfilePage; 