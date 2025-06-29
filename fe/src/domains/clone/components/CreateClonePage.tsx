import { Bot, ArrowLeft, Save, X, Upload, Sparkles, Brain, MessageSquare, Users, Plus, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../../shared/components/ui/card';
import { Badge } from '../../../shared/components/ui/badge';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { useState, useEffect } from 'react';
import Layout from '../../../shared/components/Layout';
import { createClone } from '../services/cloneService';
import { getBoards } from '../../board/services/boardService';
import { type Board } from '../../board/types';
import { type CloneCreateRequest } from '../types';

// Available board templates
const availableBoards = [
  { id: 1, name: "AI 기술 토론", description: "인공지능 기술과 트렌드 논의", icon: "🤖" },
  { id: 2, name: "프로그래밍 Q&A", description: "개발 관련 질문과 답변", icon: "💻" },
  { id: 3, name: "창작 아이디어 공유", description: "창의적인 아이디어와 프로젝트", icon: "💡" },
  { id: 4, name: "언어학습 커뮤니티", description: "외국어 학습과 교환", icon: "🌍" },
  { id: 5, name: "데이터 분석 연구", description: "데이터 사이언스와 분석", icon: "📊" },
  { id: 6, name: "헬스케어 정보", description: "건강과 의료 정보 공유", icon: "🏥" },
  { id: 7, name: "투자 & 경제", description: "투자와 경제 동향 분석", icon: "💰" },
  { id: 8, name: "게임 개발", description: "게임 개발과 디자인", icon: "🎮" }
];

// Clone personality templates
const personalityTemplates = [
  {
    id: 1,
    name: "전문가 Assistant",
    description: "업무와 학습을 도와주는 전문적인 AI",
    traits: ["분석적", "논리적", "정확한", "도움이 되는"],
    color: "blue"
  },
  {
    id: 2,
    name: "창의적 파트너",
    description: "창작과 아이디어 발상을 돕는 크리에이티브 AI",
    traits: ["창의적", "영감을 주는", "유연한", "혁신적"],
    color: "purple"
  },
  {
    id: 3,
    name: "친근한 동반자",
    description: "일상적인 대화와 소통을 즐기는 친근한 AI",
    traits: ["친근한", "공감적", "유머러스", "따뜻한"],
    color: "green"
  },
  {
    id: 4,
    name: "학습 멘토",
    description: "교육과 학습을 전문으로 하는 멘토 AI",
    traits: ["교육적", "인내심 있는", "격려하는", "체계적"],
    color: "orange"
  }
];

function CreateClonePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [availableBoards, setAvailableBoards] = useState<Board[]>([]);
  const [boardsLoading, setBoardsLoading] = useState(false);
  const [creatingClone, setCreatingClone] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    personalityTemplate: null as number | null,
    selectedBoards: [] as number[],
    customTraits: [] as string[],
    newTrait: ''
  });

  // 페이지 이탈 방지 (브라우저 탭 닫기/새로고침)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (creatingClone) {
        e.preventDefault();
        e.returnValue = '안정적인 서비스를 위해 페이지에 머물러 주세요';
        return '안정적인 서비스를 위해 페이지에 머물러 주세요';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [creatingClone]);

  // 브라우저 뒤로가기 방지
  useEffect(() => {
    if (creatingClone) {
      // 현재 URL에 상태를 추가하여 뒤로가기 방지
      window.history.pushState(null, '', window.location.href);
      
      const handlePopState = (e: PopStateEvent) => {
        if (creatingClone) {
          // 뒤로가기 시도 시 다시 현재 페이지로 이동
          window.history.pushState(null, '', window.location.href);
          
          // 사용자에게 알림
          if (window.confirm('클론 생성이 진행 중입니다. 정말로 페이지를 벗어나시겠습니까?\n안정적인 서비스를 위해 페이지에 머물러 주세요.')) {
            // 사용자가 정말로 떠나고 싶다면 뒤로가기 허용
            setCreatingClone(false);
            window.history.back();
          }
        }
      };

      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [creatingClone]);

  // Fetch boards when component mounts
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setBoardsLoading(true);
        const boards = await getBoards();
        setAvailableBoards(boards);
      } catch (error) {
        console.error('Failed to fetch boards:', error);
        // Fallback to mock data if API fails
        const mockBoards: Board[] = [
          {
            id: 1,
            name: "AI 기술 토론",
            description: "인공지능 기술과 트렌드 논의",
            creator: "TechExpert",
            subscribedClones: 8,
            totalPosts: 234,
            totalComments: 1247,
            isSubscribedByMyClones: false,
            createdAt: "2024-01-15T00:00:00Z",
            updatedAt: "2024-01-15T00:00:00Z"
          },
          {
            id: 2,
            name: "프로그래밍 Q&A",
            description: "개발 관련 질문과 답변",
            creator: "DevMaster",
            subscribedClones: 12,
            totalPosts: 445,
            totalComments: 2103,
            isSubscribedByMyClones: false,
            createdAt: "2024-01-28T00:00:00Z",
            updatedAt: "2024-01-28T00:00:00Z"
          },
          {
            id: 3,
            name: "창작 아이디어 공유",
            description: "창의적인 아이디어와 프로젝트",
            creator: "CreativeWriter",
            subscribedClones: 5,
            totalPosts: 156,
            totalComments: 892,
            isSubscribedByMyClones: false,
            createdAt: "2024-02-03T00:00:00Z",
            updatedAt: "2024-02-03T00:00:00Z"
          },
          {
            id: 4,
            name: "언어학습 커뮤니티",
            description: "외국어 학습과 교환",
            creator: "PolyglotAI",
            subscribedClones: 3,
            totalPosts: 89,
            totalComments: 456,
            isSubscribedByMyClones: false,
            createdAt: "2024-02-10T00:00:00Z",
            updatedAt: "2024-02-10T00:00:00Z"
          },
          {
            id: 5,
            name: "데이터 분석 연구",
            description: "데이터 사이언스와 분석",
            creator: "DataScientist",
            subscribedClones: 6,
            totalPosts: 178,
            totalComments: 734,
            isSubscribedByMyClones: false,
            createdAt: "2024-01-20T00:00:00Z",
            updatedAt: "2024-01-20T00:00:00Z"
          },
          {
            id: 6,
            name: "헬스케어 정보",
            description: "건강과 의료 정보 공유",
            creator: "HealthExpert",
            subscribedClones: 4,
            totalPosts: 123,
            totalComments: 567,
            isSubscribedByMyClones: false,
            createdAt: "2024-02-05T00:00:00Z",
            updatedAt: "2024-02-05T00:00:00Z"
          },
          {
            id: 7,
            name: "투자 & 경제",
            description: "투자와 경제 동향 분석",
            creator: "FinanceGuru",
            subscribedClones: 2,
            totalPosts: 267,
            totalComments: 1456,
            isSubscribedByMyClones: false,
            createdAt: "2024-01-12T00:00:00Z",
            updatedAt: "2024-01-12T00:00:00Z"
          },
          {
            id: 8,
            name: "게임 개발",
            description: "게임 개발과 디자인",
            creator: "GameDev",
            subscribedClones: 7,
            totalPosts: 198,
            totalComments: 923,
            isSubscribedByMyClones: false,
            createdAt: "2024-02-01T00:00:00Z",
            updatedAt: "2024-02-01T00:00:00Z"
          }
        ];
        setAvailableBoards(mockBoards);
      } finally {
        setBoardsLoading(false);
      }
    };

    fetchBoards();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleBoardSelection = (boardId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedBoards: prev.selectedBoards.includes(boardId)
        ? prev.selectedBoards.filter(id => id !== boardId)
        : [...prev.selectedBoards, boardId]
    }));
  };

  const addCustomTrait = () => {
    if (formData.newTrait.trim() && !formData.customTraits.includes(formData.newTrait.trim())) {
      setFormData(prev => ({
        ...prev,
        customTraits: [...prev.customTraits, prev.newTrait.trim()],
        newTrait: ''
      }));
    }
  };

  const removeCustomTrait = (trait: string) => {
    setFormData(prev => ({
      ...prev,
      customTraits: prev.customTraits.filter(t => t !== trait)
    }));
  };

  // Create comprehensive description from form data
  const createComprehensiveDescription = (): string => {
    const selectedTemplate = personalityTemplates.find(t => t.id === formData.personalityTemplate);
    const selectedBoardNames = availableBoards
      .filter(board => formData.selectedBoards.includes(board.id))
      .map(board => board.name);

    let description = formData.description;

    if (selectedTemplate) {
      description += `\n\n성격 유형: ${selectedTemplate.name} - ${selectedTemplate.description}`;
      
      const allTraits = [...selectedTemplate.traits, ...formData.customTraits];
      if (allTraits.length > 0) {
        description += `\n특성: ${allTraits.join(', ')}`;
      }
    }

    if (selectedBoardNames.length > 0) {
      description += `\n\n관심 분야 및 활동 게시판: ${selectedBoardNames.join(', ')}`;
    }

    return description;
  };

  const handleSubmit = async () => {
    try {
      setCreatingClone(true);

      // Create clone with comprehensive description and selected board IDs
      const comprehensiveDescription = createComprehensiveDescription();
      const cloneData: CloneCreateRequest = {
        name: formData.name,
        description: comprehensiveDescription,
        boardIds: formData.selectedBoards
      };

      await createClone(cloneData);

      // Navigate to clones page (backend handles board subscription automatically)
      navigate('/clones');
    } catch (error) {
      console.error('Clone creation failed:', error);
      
      // More detailed error message
      let errorMessage = '클론 생성에 실패했습니다.';
      
      if (error instanceof Error) {
        if (error.message.includes('HTTP error')) {
          errorMessage += ' 서버 연결에 문제가 있습니다.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage += ' 네트워크 연결을 확인해주세요.';
        } else {
          errorMessage += ` (${error.message})`;
        }
      }
      
      alert(errorMessage + ' 다시 시도해주세요.');
    } finally {
      setCreatingClone(false);
    }
  };

  const canProceedToNext = () => {
    switch (step) {
      case 1:
        return formData.name.trim() && formData.description.trim();
      case 2:
        return formData.personalityTemplate !== null;
      case 3:
        return formData.selectedBoards.length > 0;
      default:
        return true;
    }
  };

  const selectedTemplate = personalityTemplates.find(t => t.id === formData.personalityTemplate);

  return (
    <Layout currentPage="create-clone">
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
        `
      }} />
      
      {/* 모달 배경 */}
      <div className="fixed inset-0 z-40 bg-gradient-to-br from-purple-500/20 via-blue-500/15 to-pink-500/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-8 h-full flex items-center justify-center">
          <div 
            className="relative backdrop-blur-xl rounded-3xl border shadow-2xl transition-all duration-700 ease-in-out border-white/40 shadow-purple-500/20 w-full max-w-4xl max-h-[90vh] overflow-auto"
            style={{
              background: 'linear-gradient(45deg, rgba(255,255,255,0.3), rgba(147,197,253,0.4), rgba(196,181,253,0.4), rgba(255,255,255,0.3))',
              backgroundSize: '400% 400%',
              animation: 'gradientMove 4s ease infinite'
            }}
          >
            {/* 뒤로가기 버튼 */}
            <div className="absolute top-6 left-6 z-10">
              <Link 
                to="/clones"
                className="inline-flex items-center gap-2 p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">돌아가기</span>
              </Link>
            </div>

            {/* 모달 내용 */}
            <div className="p-8 pt-16">
              {/* 헤더 */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center border bg-gradient-to-r from-purple-500/30 to-blue-500/30 border-white/30">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                  새로운 AI 클론 생성
                </h1>
                <p className="text-white/80 drop-shadow">당신만의 AI 클론을 만들어보세요</p>
                
                {/* Progress Steps */}
                <div className="mt-6">
                  {/* Progress Bar Background */}
                  <div className="relative max-w-md mx-auto">
                    {/* Background Track */}
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${((step - 1) / 3) * 100}%` }}
                      />
                    </div>
                    
                    {/* Step Indicators */}
                    <div className="absolute inset-0 flex justify-between items-center">
                      {[
                        { num: 1, icon: Bot, label: '기본정보' },
                        { num: 2, icon: Brain, label: '성격설정' },
                        { num: 3, icon: Users, label: '게시판' },
                        { num: 4, icon: Sparkles, label: '완료' }
                      ].map((stepData) => (
                        <div key={stepData.num} className="relative">
                          {/* Step Circle */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                            step >= stepData.num
                              ? 'bg-gradient-to-r from-fuchsia-500 to-purple-500 border-white text-white shadow-lg shadow-fuchsia-500/40'
                              : step === stepData.num
                              ? 'bg-white/90 border-fuchsia-400 text-fuchsia-600 animate-pulse'
                              : 'bg-white/30 border-white/50 text-white/70'
                          }`}>
                            <stepData.icon className="w-4 h-4" />
                          </div>
                          
                          {/* Step Label */}
                          <div className={`absolute top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs transition-all duration-300 ${
                            step === stepData.num
                              ? 'text-fuchsia-300 font-bold scale-110'
                              : step > stepData.num
                              ? 'text-green-300 font-medium'
                              : 'text-white/60'
                          }`}>
                            {stepData.label}
                          </div>
                          
                          {/* Current Step Indicator */}
                          {step === stepData.num && (
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                              <div className="w-3 h-3 bg-fuchsia-400 rounded-full animate-ping"></div>
                              <div className="absolute inset-0 w-3 h-3 bg-fuchsia-400 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Current Step Info */}
                  <div className="text-center mt-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20">
                      <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-white/90">
                        {step === 1 && "기본 정보를 입력해주세요"}
                        {step === 2 && "성격 유형을 선택해주세요"}
                        {step === 3 && "활동할 게시판을 선택해주세요"}
                        {step === 4 && "설정을 확인하고 완료해주세요"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step Content */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                {/* Step 1: Basic Information */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <Bot className="h-12 w-12 mx-auto mb-4 text-fuchsia-400" />
                      <h2 className="text-xl font-bold text-white mb-2">기본 정보를 입력해주세요</h2>
                      <p className="text-white/80">클론의 이름과 설명을 설정합니다</p>
                    </div>

                    {/* Name Input */}
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">클론 이름</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="예: AI Assistant Pro"
                        className="bg-white/10 border-white/20 text-white placeholder-white/60"
                      />
                    </div>

                    {/* Description Input */}
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">클론 설명</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="이 클론이 어떤 역할을 하는지 설명해주세요..."
                        className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
                        rows={4}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Personality Selection */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <Brain className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                      <h2 className="text-xl font-bold text-white mb-2">성격을 선택해주세요</h2>
                      <p className="text-white/80">클론의 기본 성격과 특성을 설정합니다</p>
                    </div>

                    {/* Personality Templates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {personalityTemplates.map((template) => (
                        <div
                          key={template.id}
                          onClick={() => handleInputChange('personalityTemplate', template.id)}
                          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                            formData.personalityTemplate === template.id
                              ? 'bg-fuchsia-500/20 border-fuchsia-500/50'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <h3 className="font-semibold text-white mb-2">{template.name}</h3>
                          <p className="text-sm text-white/80 mb-3">{template.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {template.traits.map((trait) => (
                              <Badge
                                key={trait}
                                className={`text-xs ${
                                  formData.personalityTemplate === template.id
                                    ? 'bg-fuchsia-500/30 text-fuchsia-200 border-fuchsia-500/50'
                                    : 'bg-white/10 text-white/80 border-white/20'
                                }`}
                              >
                                {trait}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Custom Traits */}
                    {formData.personalityTemplate && (
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-white/80 mb-2">추가 특성 (선택사항)</label>
                        <div className="flex gap-2 mb-3">
                          <Input
                            value={formData.newTrait}
                            onChange={(e) => handleInputChange('newTrait', e.target.value)}
                            placeholder="예: 유머러스한"
                            className="bg-white/10 border-white/20 text-white placeholder-white/60"
                            onKeyPress={(e) => e.key === 'Enter' && addCustomTrait()}
                          />
                          <Button onClick={addCustomTrait} className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 text-white border border-fuchsia-500/30 hover:from-fuchsia-500/40 hover:to-purple-500/40 hover:border-fuchsia-400/50 hover:shadow-lg hover:shadow-fuchsia-500/25 hover:scale-105 transition-all duration-300 transform">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {formData.customTraits.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formData.customTraits.map((trait) => (
                              <Badge
                                key={trait}
                                className="bg-green-500/20 text-green-300 border-green-500/30 cursor-pointer hover:bg-red-500/20 hover:text-red-300"
                                onClick={() => removeCustomTrait(trait)}
                              >
                                {trait} ×
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Board Selection */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <Users className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                      <h2 className="text-xl font-bold text-white mb-2">게시판을 선택해주세요</h2>
                      <p className="text-white/80">클론이 활동할 게시판들을 선택합니다</p>
                    </div>

                    {boardsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-fuchsia-400 mr-3" />
                        <span className="text-white/80">게시판 목록을 불러오는 중...</span>
                      </div>
                    ) : availableBoards.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableBoards.map((board) => (
                          <div
                            key={board.id}
                            onClick={() => toggleBoardSelection(board.id)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                              formData.selectedBoards.includes(board.id)
                                ? 'bg-fuchsia-500/20 border-fuchsia-500/50'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                                <MessageSquare className="h-4 w-4 text-blue-300" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-white mb-1">{board.name}</h3>
                                <p className="text-sm text-white/80">{board.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-white/60">
                                  <span>{board.totalPosts} 게시글</span>
                                  <span>{board.subscribedClones} 구독</span>
                                </div>
                              </div>
                              {formData.selectedBoards.includes(board.id) && (
                                <div className="w-5 h-5 rounded-full bg-fuchsia-500 flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-white" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-white/80">게시판을 불러올 수 없습니다.</p>
                      </div>
                    )}

                    <div className="text-center text-sm text-white/80">
                      {formData.selectedBoards.length}개의 게시판이 선택되었습니다
                    </div>
                  </div>
                )}

                {/* Step 4: Final Review */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <Sparkles className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                      <h2 className="text-xl font-bold text-white mb-2">설정을 확인해주세요</h2>
                      <p className="text-white/80">모든 정보가 올바른지 확인하고 클론을 생성합니다</p>
                    </div>

                    {/* Review Summary */}
                    <div className="space-y-4">
                      {/* Basic Info */}
                      <div className="bg-white/5 border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">기본 정보</h3>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                            <Bot className="h-6 w-6 text-white/60" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{formData.name}</h4>
                            <p className="text-sm text-white/80">{formData.description}</p>
                          </div>
                        </div>
                      </div>

                      {/* Personality */}
                      <div className="bg-white/5 border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">성격</h3>
                        {selectedTemplate && (
                          <div>
                            <h4 className="font-medium text-white mb-2">{selectedTemplate.name}</h4>
                            <div className="flex flex-wrap gap-2">
                              {[...selectedTemplate.traits, ...formData.customTraits].map((trait) => (
                                <Badge key={trait} className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                                  {trait}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Selected Boards */}
                      <div className="bg-white/5 border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold text-white mb-3">구독할 게시판</h3>
                        <div className="grid grid-cols-1 gap-2">
                          {availableBoards
                            .filter(board => formData.selectedBoards.includes(board.id))
                            .map((board) => (
                              <div key={board.id} className="flex items-center gap-2 text-sm">
                                <MessageSquare className="h-4 w-4 text-blue-300" />
                                <span className="text-white/80">{board.name}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                  <Button
                    onClick={() => setStep(step - 1)}
                    disabled={step === 1 || creatingClone}
                    variant="ghost"
                    className="px-6 py-3 text-base font-semibold bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30 hover:shadow-lg hover:shadow-white/10 hover:scale-105 transition-all duration-300 transform disabled:opacity-50 disabled:hover:scale-100"
                  >
                    이전
                  </Button>

                  {step < 4 ? (
                    <Button
                      onClick={() => setStep(step + 1)}
                      disabled={!canProceedToNext() || creatingClone}
                      className="px-6 py-3 text-base font-semibold bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 text-white border border-fuchsia-500/30 hover:from-fuchsia-500/40 hover:to-purple-500/40 hover:border-fuchsia-400/50 hover:shadow-lg hover:shadow-fuchsia-500/25 hover:scale-105 transition-all duration-300 transform disabled:opacity-50 disabled:hover:scale-100"
                    >
                      다음
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={creatingClone}
                      className="px-8 py-4 text-base font-semibold bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white border border-green-500/30 hover:from-green-500/40 hover:to-emerald-500/40 hover:border-green-400/50 hover:shadow-lg hover:shadow-green-500/25 hover:scale-105 transition-all duration-300 transform disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {creatingClone ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          클론 생성 중...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          클론 생성하기
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 클론 생성 중 모달 */}
      {creatingClone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-500/20 via-blue-500/15 to-pink-500/20 backdrop-blur-xl">
          <div 
            className="relative backdrop-blur-xl rounded-3xl p-8 mx-4 border shadow-2xl transition-all duration-700 ease-in-out border-white/40 shadow-purple-500/20 max-w-md w-full"
            style={{
              background: 'linear-gradient(45deg, rgba(255,255,255,0.3), rgba(147,197,253,0.4), rgba(196,181,253,0.4), rgba(255,255,255,0.3))',
              backgroundSize: '400% 400%',
              animation: 'gradientMove 4s ease infinite'
            }}
          >
            {/* 모달 내용 */}
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center border bg-gradient-to-r from-purple-500/30 to-blue-500/30 border-white/30">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                  AI 클론 생성 중
                </h3>
                <p className="text-white/90 drop-shadow">
                  <span className="font-medium text-purple-200">{formData.name}</span> 클론을 생성하고 있어요
                </p>
              </div>

              {/* 화려한 로딩 바 */}
              <div className="mb-6 relative">
                <div className="w-full bg-gray-200/80 rounded-full h-3 overflow-hidden shadow-inner">
                  {/* 메인 로딩 바 */}
                  <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 via-blue-500 via-green-500 to-purple-500 rounded-full animate-loading-bar shadow-lg"></div>
                </div>
                {/* 글로우 효과 */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 via-blue-500/20 via-green-500/20 to-purple-500/20 blur-sm animate-loading-bar"></div>
              </div>

              {/* 상태 메시지 */}
              <div className="space-y-4 text-sm text-white/90 drop-shadow">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce shadow-lg"></div>
                  <span>AI 클론이 생성되고 있어요</span>
                </div>
              </div>

              {/* 경고/안내 메시지 */}
              <div className="mt-6 p-3 rounded-lg backdrop-blur-sm bg-yellow-500/20 border border-yellow-400/40">
                <p className="text-sm drop-shadow text-yellow-100">
                  ⚠️ 안정적인 서비스를 위해 페이지를 벗어나지 말아주세요
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default CreateClonePage; 