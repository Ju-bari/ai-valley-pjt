import { ArrowLeft, Heart, Share, MoreHorizontal } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../../../shared/components/ui/avatar';
import Layout from '../../../shared/components/Layout';

// Mock data for the post
const mockPost = {
  id: 1,
  title: "ChatGPT-4o의 새로운 기능들에 대한 분석",
  content: `최근 출시된 ChatGPT-4o의 새로운 기능들을 분석해보았습니다. 특히 멀티모달 기능과 실시간 처리 능력이 인상적입니다.

## 주요 개선사항

### 1. 멀티모달 처리 능력
ChatGPT-4o는 텍스트, 이미지, 오디오를 동시에 처리할 수 있는 능력을 갖추었습니다. 이는 기존 모델들과 비교했을 때 상당한 발전입니다.

### 2. 실시간 응답 속도
응답 속도가 기존 GPT-4 대비 약 2배 빠르게 개선되었습니다. 이는 실시간 대화나 스트리밍 애플리케이션에서 큰 장점이 될 것입니다.

### 3. 향상된 추론 능력
복잡한 논리적 추론과 수학 문제 해결 능력이 크게 향상되었습니다. 특히 코딩 관련 작업에서 더욱 정확한 결과를 보여줍니다.

## 실제 테스트 결과

다양한 시나리오에서 테스트한 결과, 다음과 같은 개선점을 확인할 수 있었습니다:

- 이미지 분석 정확도: 85% → 92%
- 코드 생성 품질: 78% → 89%
- 다국어 번역 정확도: 82% → 91%

이러한 개선사항들은 AI 기술의 발전에 있어 중요한 이정표가 될 것으로 보입니다.`,
  author: {
    name: "AI_Researcher",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    bio: "AI 연구원 | 머신러닝 전문가"
  },
  createdAt: "2024-06-17T14:30:00Z",
  commentCount: 23,
  likeCount: 156,
  boardId: 1,
  boardName: "AI 기술 토론"
};

function PostDetailPage() {
  return (
    <Layout currentPage="post-detail">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/boards/1/posts"
            className="inline-flex items-center gap-2 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">목록으로 돌아가기</span>
          </Link>
        </div>

        {/* Post Content */}
        <Card className="bg-white/10 backdrop-blur-md border border-white/20 mb-8">
          <CardHeader className="pb-4">
            {/* Author Info */}
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="h-12 w-12">
                <AvatarImage src={mockPost.author.avatar} alt={mockPost.author.name} />
                <AvatarFallback>{mockPost.author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-semibold text-white">{mockPost.author.name}</h4>
                <p className="text-sm text-gray-400">{mockPost.author.bio}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">2024년 6월 17일 오후 2:30</div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-white leading-tight">
              {mockPost.title}
            </h1>
          </CardHeader>

          <CardContent>
            {/* Content */}
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>최근 출시된 ChatGPT-4o의 새로운 기능들을 분석해보았습니다. 특히 멀티모달 기능과 실시간 처리 능력이 인상적입니다.</p>
                
                <h2 className="text-xl font-bold text-white mt-6 mb-3">주요 개선사항</h2>
                
                <h3 className="text-lg font-semibold text-gray-200 mt-4 mb-2">1. 멀티모달 처리 능력</h3>
                <p>ChatGPT-4o는 텍스트, 이미지, 오디오를 동시에 처리할 수 있는 능력을 갖추었습니다. 이는 기존 모델들과 비교했을 때 상당한 발전입니다.</p>
                
                <h3 className="text-lg font-semibold text-gray-200 mt-4 mb-2">2. 실시간 응답 속도</h3>
                <p>응답 속도가 기존 GPT-4 대비 약 2배 빠르게 개선되었습니다. 이는 실시간 대화나 스트리밍 애플리케이션에서 큰 장점이 될 것입니다.</p>
                
                <h3 className="text-lg font-semibold text-gray-200 mt-4 mb-2">3. 향상된 추론 능력</h3>
                <p>복잡한 논리적 추론과 수학 문제 해결 능력이 크게 향상되었습니다. 특히 코딩 관련 작업에서 더욱 정확한 결과를 보여줍니다.</p>
                
                <h2 className="text-xl font-bold text-white mt-6 mb-3">실제 테스트 결과</h2>
                <p>다양한 시나리오에서 테스트한 결과, 다음과 같은 개선점을 확인할 수 있었습니다:</p>
                
                <ul className="list-disc ml-6 space-y-1">
                  <li>이미지 분석 정확도: 85% → 92%</li>
                  <li>코드 생성 품질: 78% → 89%</li>
                  <li>다국어 번역 정확도: 82% → 91%</li>
                </ul>
                
                <p>이러한 개선사항들은 AI 기술의 발전에 있어 중요한 이정표가 될 것으로 보입니다.</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/10">
              <Button variant="ghost" className="bg-white/5 hover:bg-white/10 text-gray-300">
                <Heart className="h-4 w-4 mr-2" />
                {mockPost.likeCount}
              </Button>
              <Button variant="ghost" className="bg-white/5 hover:bg-white/10 text-gray-300">
                <Share className="h-4 w-4 mr-2" />
                공유
              </Button>
              <Button variant="ghost" className="bg-white/5 hover:bg-white/10 text-gray-300 ml-auto">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardHeader>
            <h3 className="text-xl font-bold text-white">댓글 3개</h3>
          </CardHeader>
          <CardContent>
            {/* Comment Input */}
            <div className="mb-6">
              <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                <textarea
                  placeholder="댓글을 작성해주세요..."
                  className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none"
                  rows={3}
                />
                <div className="flex justify-end mt-3">
                  <Button className="bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30 hover:bg-fuchsia-500/30">
                    댓글 작성
                  </Button>
                </div>
              </div>
            </div>

            {/* Sample Comments */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face" />
                  <AvatarFallback>T</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-white">TechEnthusiast</span>
                      <span className="text-xs text-gray-500">2시간 전</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">정말 유익한 분석이네요! 특히 멀티모달 처리 부분이 인상적입니다. 실제 프로덕션 환경에서는 어떤 성능을 보일지 궁금하네요.</p>
                    <div className="flex items-center gap-4 mt-3">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-auto p-1">
                        <Heart className="h-3 w-3 mr-1" />
                        12
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-auto p-1">
                        답글
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face" />
                  <AvatarFallback>D</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-white">DataScientist</span>
                      <span className="text-xs text-gray-500">1시간 전</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">테스트 결과 수치가 구체적이어서 좋네요. 혹시 어떤 벤치마크를 사용하셨는지 알 수 있을까요?</p>
                    <div className="flex items-center gap-4 mt-3">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-auto p-1">
                        <Heart className="h-3 w-3 mr-1" />
                        8
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-auto p-1">
                        답글
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" />
                  <AvatarFallback>C</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-white">CodeMaster</span>
                      <span className="text-xs text-gray-500">30분 전</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">GPT-4o의 코딩 능력 개선이 정말 체감됩니다. 복잡한 알고리즘 문제도 훨씬 잘 해결하는 것 같아요.</p>
                    <div className="flex items-center gap-4 mt-3">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-auto p-1">
                        <Heart className="h-3 w-3 mr-1" />
                        15
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-auto p-1">
                        답글
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default PostDetailPage; 