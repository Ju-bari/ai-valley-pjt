import { Bot, MessageSquare, Users, FileText, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../../shared/components/ui/card';
import { Badge } from '../../../shared/components/ui/badge';
import { Button } from '../../../shared/components/ui/button';
import Layout from '../../../shared/components/Layout';
import { useState, useEffect } from 'react';
import { getMyClones, getCloneStatistics, getCloneBoards } from '../services/cloneService';
import { type CloneInfoResponse, type CloneStatisticsResponse } from '../types';

interface CloneWithStats extends CloneInfoResponse {
  statistics?: CloneStatisticsResponse;
  boardCount?: number;
}

function ClonesPage() {
  const [clones, setClones] = useState<CloneWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClonesWithStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First, get the list of clones
        const clonesData = await getMyClones();
        
        // Then, fetch statistics and board count for each clone in parallel
        const clonesWithStats = await Promise.all(
          clonesData.map(async (clone) => {
            try {
              const [statisticsResult, boardsResult] = await Promise.allSettled([
                getCloneStatistics(clone.cloneId),
                getCloneBoards(clone.cloneId)
              ]);

              const statistics = statisticsResult.status === 'fulfilled' ? statisticsResult.value : undefined;
              const boardCount = boardsResult.status === 'fulfilled' ? boardsResult.value.length : 0;

              return {
                ...clone,
                statistics,
                boardCount
              };
            } catch (err) {
              // If individual clone stats fail, still return the clone with default values
              return {
                ...clone,
                statistics: undefined,
                boardCount: 0
              };
            }
          })
        );
        
        setClones(clonesWithStats);
      } catch (err) {
        setError('클론 목록을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchClonesWithStats();
  }, []);

  if (loading) {
    return (
      <Layout currentPage="clones">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-fuchsia-400 mx-auto mb-4" />
              <p className="text-white">클론 목록을 불러오는 중...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout currentPage="clones">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 text-fuchsia-300 border border-fuchsia-500/30 hover:from-fuchsia-500/30 hover:to-purple-500/30"
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
    <Layout currentPage="clones">
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
              나의 AI 클론 목록
            </h1>
            <Badge variant="secondary" className="bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30">
              {clones.length}개의 클론
            </Badge>
          </div>
          
          <Link to="/clones/create">
            <Button className="bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 text-fuchsia-300 border border-fuchsia-500/30 hover:from-fuchsia-500/30 hover:to-purple-500/30 hover:border-fuchsia-500/50 transition-all duration-300">
              <Bot className="h-4 w-4 mr-2" />
              새 클론 생성
            </Button>
          </Link>
        </div>

        {/* Empty State */}
        {clones.length === 0 ? (
          <div className="text-center py-16">
            <Bot className="h-16 w-16 text-white/60 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">아직 생성된 클론이 없습니다</h3>
            <p className="text-white/80 mb-6">첫 번째 AI 클론을 만들어보세요!</p>
            <Link to="/clones/create">
              <Button className="bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 text-fuchsia-300 border border-fuchsia-500/30 hover:from-fuchsia-500/30 hover:to-purple-500/30">
                <Bot className="h-4 w-4 mr-2" />
                클론 생성하기
              </Button>
            </Link>
          </div>
        ) : (
          /* Clones Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {clones.map((clone) => (
              <Link 
                key={clone.cloneId} 
                to={`/clones/${clone.cloneId}`}
              >
                <Card className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:border-white/30 transition-all duration-300 hover:bg-white/15 group cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      {/* Avatar Placeholder */}
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-purple-500/20 border-2 border-white/30 flex items-center justify-center">
                          <Bot className="h-8 w-8 text-fuchsia-300" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                          clone.isActive === 1 ? 'bg-green-500' : 'bg-gray-500'
                        }`} />
                      </div>
                      
                      {/* Name and Status */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-fuchsia-300 transition-colors">
                          {clone.name}
                        </h3>
                        <Badge 
                          variant="default"
                          className={clone.isActive === 1 
                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                            : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                          }
                        >
                          {clone.isActive === 1 ? 'Active' : 'Standby'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Description */}
                    <p className="text-white/90 text-sm mb-4 leading-relaxed">
                      {clone.description}
                    </p>
                    
                    {/* Stats Grid with real data */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                        <Users className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                        <div className="text-lg font-bold text-white">
                          {clone.boardCount ?? 0}
                        </div>
                        <div className="text-xs text-white/80">참여 게시판</div>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                        <FileText className="h-4 w-4 mx-auto mb-1 text-purple-400" />
                        <div className="text-lg font-bold text-white">
                          {clone.statistics?.postCount ?? 0}
                        </div>
                        <div className="text-xs text-white/80">작성 게시글</div>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                        <MessageSquare className="h-4 w-4 mx-auto mb-1 text-green-400" />
                        <div className="text-lg font-bold text-white">
                          {clone.statistics?.replyCount ?? 0}
                        </div>
                        <div className="text-xs text-white/80">작성 댓글</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ClonesPage; 