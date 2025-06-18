import { ArrowLeft, Calendar, User, MessageSquare, Plus, Search } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent } from '../../../shared/components/ui/card';
import { Badge } from '../../../shared/components/ui/badge';
import { Button } from '../../../shared/components/ui/button';
import Layout from '../../../shared/components/Layout';

// Mock data for boards (to get board info)
const mockBoards = [
  {
    id: 1,
    name: "AI 기술 토론",
    creator: "TechExpert",
    description: "최신 AI 기술 트렌드와 발전 방향에 대해 토론하는 게시판입니다."
  },
  {
    id: 2,
    name: "창작 아이디어 공유",
    creator: "CreativeWriter",
    description: "소설, 시나리오, 게임 스토리 등 창작물에 대한 아이디어를 공유하고 피드백을 받는 커뮤니티입니다."
  },
  {
    id: 3,
    name: "프로그래밍 Q&A",
    creator: "DevMaster",
    description: "프로그래밍 관련 질문과 답변을 나누는 게시판입니다."
  }
];

// Mock data for posts
const mockPosts = [
  {
    id: 1,
    title: "ChatGPT-4o의 새로운 기능들에 대한 분석",
    content: "최근 출시된 ChatGPT-4o의 새로운 기능들을 분석해보았습니다. 특히 멀티모달 기능과 실시간 처리 능력이 인상적입니다...",
    author: "AI_Researcher",
    createdAt: "2024-06-17T14:30:00Z",
    commentCount: 23,
    boardId: 1
  },
  {
    id: 2,
    title: "머신러닝 모델 최적화 방법론 정리",
    content: "다양한 머신러닝 모델 최적화 기법들을 정리해보았습니다. 하이퍼파라미터 튜닝부터 모델 압축까지...",
    author: "MLExpert",
    createdAt: "2024-06-17T10:15:00Z",
    commentCount: 15,
    boardId: 1
  },
  {
    id: 3,
    title: "트랜스포머 아키텍처의 발전 과정",
    content: "Attention is All You Need 논문부터 최신 트랜스포머 변형들까지의 발전 과정을 살펴보겠습니다...",
    author: "DeepLearner",
    createdAt: "2024-06-16T16:45:00Z",
    commentCount: 31,
    boardId: 1
  },
  {
    id: 4,
    title: "LLM 파인튜닝 실전 가이드",
    content: "대규모 언어 모델을 특정 도메인에 맞게 파인튜닝하는 실전 가이드입니다. LoRA, QLoRA 등의 효율적인 방법들을 다룹니다...",
    author: "FineTuner",
    createdAt: "2024-06-16T09:20:00Z",
    commentCount: 42,
    boardId: 1
  },
  {
    id: 5,
    title: "AI 윤리와 편향성 문제 해결 방안",
    content: "AI 시스템의 윤리적 문제와 편향성을 해결하기 위한 다양한 접근 방법들을 논의해보겠습니다...",
    author: "EthicsExpert",
    createdAt: "2024-06-15T13:10:00Z",
    commentCount: 18,
    boardId: 1
  },
  {
    id: 6,
    title: "강화학습을 활용한 게임 AI 개발",
    content: "강화학습 알고리즘을 사용하여 게임 AI를 개발하는 과정과 노하우를 공유합니다...",
    author: "GameAI_Dev",
    createdAt: "2024-06-15T11:30:00Z",
    commentCount: 27,
    boardId: 1
  },
  {
    id: 7,
    title: "컴퓨터 비전 최신 동향 2024",
    content: "2024년 컴퓨터 비전 분야의 최신 연구 동향과 주요 브레이크스루들을 정리했습니다...",
    author: "VisionExpert",
    createdAt: "2024-06-14T15:45:00Z",
    commentCount: 12,
    boardId: 1
  },
  {
    id: 8,
    title: "자연어 처리 전처리 기법 비교 분석",
    content: "다양한 NLP 전처리 기법들의 성능을 비교 분석한 결과를 공유합니다...",
    author: "NLP_Analyst",
    createdAt: "2024-06-14T08:15:00Z",
    commentCount: 9,
    boardId: 1
  }
];

function PostsPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const currentBoard = mockBoards.find(board => board.id === parseInt(boardId || '1'));
  const boardPosts = mockPosts.filter(post => post.boardId === parseInt(boardId || '1'));

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

  const formatCommentCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  if (!currentBoard) {
    return <div>게시판을 찾을 수 없습니다.</div>;
  }

  return (
    <Layout currentPage="posts">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              to="/boards" 
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {currentBoard.name}
              </h1>
              <p className="text-gray-400 text-sm mt-1">{currentBoard.description}</p>
            </div>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              {boardPosts.length}개의 게시글
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="게시글 검색..."
                  className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-l-full text-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent transition-all duration-300 placeholder-gray-400 text-white w-64"
                />
              </div>
              <Button className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30 backdrop-blur-sm rounded-r-full px-4 py-2">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Button className="bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30 hover:bg-fuchsia-500/30 backdrop-blur-sm">
              <Plus className="h-4 w-4 mr-2" />
              새 글 작성
            </Button>
          </div>
        </div>

        {/* Posts List */}
        <div>
          {boardPosts.map((post, index) => (
            <div key={post.id} className={index > 0 ? "mt-2" : ""}>
              <Link to={`/boards/${boardId}/posts/${post.id}`}>
                <Card 
                  className="bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-300 hover:bg-white/15 group cursor-pointer"
                >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-gray-200 text-base mb-3 line-clamp-2 leading-relaxed">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <div className="flex items-center gap-1 bg-white/5 rounded-full px-3 py-1 border border-white/10">
                        <MessageSquare className="h-3 w-3 text-green-400" />
                        <span className="text-sm font-medium text-white">{formatCommentCount(post.commentCount)}</span>
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
        {boardPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-white/20">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-white mb-2">게시글이 없습니다</h3>
              <p className="text-gray-400 mb-4">이 게시판에 첫 번째 글을 작성해보세요!</p>
              <Button className="bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30 hover:bg-fuchsia-500/30">
                <Plus className="h-4 w-4 mr-2" />
                새 글 작성
              </Button>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {boardPosts.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              variant="ghost" 
              className="bg-white/10 text-gray-300 border-white/20 hover:bg-white/20 backdrop-blur-sm"
            >
              더 많은 게시글 보기
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default PostsPage; 