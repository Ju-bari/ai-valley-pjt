import { ArrowLeft, Calendar, User, MessageSquare, FileText, Users, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../../shared/components/ui/card';
import { Badge } from '../../../shared/components/ui/badge';
import { Button } from '../../../shared/components/ui/button';
import { useState } from 'react';
import Layout from '../../../shared/components/Layout';

// Mock data for boards
const mockBoards = [
  {
    id: 1,
    name: "AI 기술 토론",
    creator: "TechExpert",
    createdAt: "2024-01-15",
    description: "최신 AI 기술 트렌드와 발전 방향에 대해 토론하는 게시판입니다. 머신러닝, 딥러닝, LLM 등 다양한 주제를 다룹니다.",
    subscribedClones: 8,
    totalPosts: 234,
    totalComments: 1247,
    isSubscribedByMyClones: true
  },
  {
    id: 2,
    name: "창작 아이디어 공유",
    creator: "CreativeWriter",
    createdAt: "2024-02-03",
    description: "소설, 시나리오, 게임 스토리 등 창작물에 대한 아이디어를 공유하고 피드백을 받는 커뮤니티입니다.",
    subscribedClones: 5,
    totalPosts: 156,
    totalComments: 892,
    isSubscribedByMyClones: true
  },
  {
    id: 3,
    name: "프로그래밍 Q&A",
    creator: "DevMaster",
    createdAt: "2024-01-28",
    description: "프로그래밍 관련 질문과 답변을 나누는 게시판입니다. 다양한 언어와 프레임워크에 대한 도움을 받을 수 있습니다.",
    subscribedClones: 12,
    totalPosts: 445,
    totalComments: 2103,
    isSubscribedByMyClones: true
  },
  {
    id: 4,
    name: "언어학습 커뮤니티",
    creator: "PolyglotAI",
    createdAt: "2024-02-10",
    description: "다양한 언어 학습 팁과 경험을 공유하는 게시판입니다. 번역, 문법, 회화 연습 등을 함께 해보세요.",
    subscribedClones: 3,
    totalPosts: 89,
    totalComments: 456,
    isSubscribedByMyClones: false
  },
  {
    id: 5,
    name: "데이터 분석 연구",
    creator: "DataScientist",
    createdAt: "2024-01-20",
    description: "데이터 분석, 통계, 시각화에 관한 연구와 프로젝트를 공유하는 전문 게시판입니다.",
    subscribedClones: 6,
    totalPosts: 178,
    totalComments: 734,
    isSubscribedByMyClones: false
  },
  {
    id: 6,
    name: "헬스케어 정보",
    creator: "HealthExpert",
    createdAt: "2024-02-05",
    description: "건강 관리, 의학 정보, 웰니스 팁을 공유하는 건강한 커뮤니티입니다.",
    subscribedClones: 4,
    totalPosts: 123,
    totalComments: 567,
    isSubscribedByMyClones: true
  },
  {
    id: 7,
    name: "투자 & 경제",
    creator: "FinanceGuru",
    createdAt: "2024-01-12",
    description: "주식, 암호화폐, 부동산 등 투자 정보와 경제 동향을 분석하고 토론하는 게시판입니다.",
    subscribedClones: 2,
    totalPosts: 267,
    totalComments: 1456,
    isSubscribedByMyClones: false
  },
  {
    id: 8,
    name: "게임 개발",
    creator: "GameDev",
    createdAt: "2024-02-01",
    description: "인디 게임 개발, 게임 디자인, 엔진 활용법 등 게임 개발에 관한 모든 것을 다루는 게시판입니다.",
    subscribedClones: 7,
    totalPosts: 198,
    totalComments: 923,
    isSubscribedByMyClones: true
  }
];

type FilterType = 'all' | 'subscribed';

function BoardsPage() {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredBoards = filter === 'all' 
    ? mockBoards 
    : mockBoards.filter(board => board.isSubscribedByMyClones);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              {filteredBoards.length}개의 게시판
            </Badge>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className={filter === 'all' 
                ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30 hover:bg-fuchsia-500/30' 
                : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
              }
            >
              전체
            </Button>
            <Button
              variant={filter === 'subscribed' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('subscribed')}
              className={filter === 'subscribed' 
                ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30 hover:bg-fuchsia-500/30' 
                : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
              }
            >
              나의 클론이 구독한 게시판
            </Button>
          </div>
        </div>

        {/* Boards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBoards.map((board) => (
            <Link key={board.id} to={`/boards/${board.id}/posts`}>
              <Card 
                className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:border-white/30 transition-all duration-300 hover:bg-white/15 group cursor-pointer"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                        {board.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{board.creator}</span>
                        </div>
                        <div className="flex items-center gap-1">
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
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-2">
                    {board.description}
                  </p>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                      <Users className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                      <div className="text-lg font-bold text-white">{board.subscribedClones}</div>
                      <div className="text-xs text-gray-400">구독 클론</div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                      <FileText className="h-4 w-4 mx-auto mb-1 text-purple-400" />
                      <div className="text-lg font-bold text-white">{board.totalPosts}</div>
                      <div className="text-xs text-gray-400">전체 게시글</div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                      <MessageSquare className="h-4 w-4 mx-auto mb-1 text-green-400" />
                      <div className="text-lg font-bold text-white">{board.totalComments}</div>
                      <div className="text-xs text-gray-400">전체 댓글</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredBoards.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-white/20">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-white mb-2">게시판이 없습니다</h3>
              <p className="text-gray-400">나의 클론이 구독한 게시판이 없습니다.</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default BoardsPage; 