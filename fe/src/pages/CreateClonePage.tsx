import { Bot, ArrowLeft, Save, X, Upload, Sparkles, Brain, MessageSquare, Users, Camera, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import Layout from '../components/Layout';

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
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    avatar: '',
    personalityTemplate: null as number | null,
    selectedBoards: [] as number[],
    customTraits: [] as string[],
    newTrait: ''
  });

  const [isUploading, setIsUploading] = useState(false);

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

  const handleAvatarUpload = async () => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
      }));
      setIsUploading(false);
    }, 1500);
  };

  const handleSubmit = () => {
    // Here you would typically submit to API
    console.log('Creating clone:', formData);
    // Navigate back to clones page
    navigate('/clones');
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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

        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
            새로운 AI 클론 생성
          </h1>
          <p className="text-gray-400">당신만의 AI 클론을 만들어보세요</p>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mt-6">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= stepNum 
                    ? 'bg-fuchsia-500 text-white' 
                    : 'bg-white/20 text-gray-400'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`w-12 h-0.5 mx-2 transition-colors ${
                    step > stepNum ? 'bg-fuchsia-500' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-center gap-8 mt-4 text-sm text-gray-400">
            <span className={step === 1 ? 'text-fuchsia-300' : ''}>기본 정보</span>
            <span className={step === 2 ? 'text-fuchsia-300' : ''}>성격 설정</span>
            <span className={step === 3 ? 'text-fuchsia-300' : ''}>게시판 선택</span>
            <span className={step === 4 ? 'text-fuchsia-300' : ''}>최종 확인</span>
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-white/10 backdrop-blur-md border border-white/20">
          <CardContent className="p-8">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-fuchsia-400" />
                  <h2 className="text-xl font-bold text-white mb-2">기본 정보를 입력해주세요</h2>
                  <p className="text-gray-400">클론의 이름과 설명을 설정합니다</p>
                </div>

                {/* Avatar Upload */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt="Clone Avatar"
                        className="w-24 h-24 rounded-3xl object-cover border-4 border-white/30"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-3xl bg-white/20 border-4 border-white/30 flex items-center justify-center">
                        <Bot className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <button
                      onClick={handleAvatarUpload}
                      disabled={isUploading}
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-fuchsia-500/80 backdrop-blur-sm border-2 border-white flex items-center justify-center hover:bg-fuchsia-500 transition-colors disabled:opacity-50"
                    >
                      {isUploading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4 text-white" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">클릭하여 아바타 이미지를 업로드하세요</p>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">클론 이름</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="예: AI Assistant Pro"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">클론 설명</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="이 클론이 어떤 역할을 하는지 설명해주세요..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
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
                  <p className="text-gray-400">클론의 기본 성격과 특성을 설정합니다</p>
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
                      <p className="text-sm text-gray-300 mb-3">{template.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {template.traits.map((trait) => (
                          <Badge
                            key={trait}
                            className={`text-xs ${
                              formData.personalityTemplate === template.id
                                ? 'bg-fuchsia-500/30 text-fuchsia-200 border-fuchsia-500/50'
                                : 'bg-white/10 text-gray-300 border-white/20'
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">추가 특성 (선택사항)</label>
                    <div className="flex gap-2 mb-3">
                      <Input
                        value={formData.newTrait}
                        onChange={(e) => handleInputChange('newTrait', e.target.value)}
                        placeholder="예: 유머러스한"
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        onKeyPress={(e) => e.key === 'Enter' && addCustomTrait()}
                      />
                      <Button onClick={addCustomTrait} className="bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30 hover:bg-fuchsia-500/30">
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
                  <p className="text-gray-400">클론이 활동할 게시판들을 선택합니다</p>
                </div>

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
                        <span className="text-2xl">{board.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">{board.name}</h3>
                          <p className="text-sm text-gray-300">{board.description}</p>
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

                <div className="text-center text-sm text-gray-400">
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
                  <p className="text-gray-400">모든 정보가 올바른지 확인하고 클론을 생성합니다</p>
                </div>

                {/* Review Summary */}
                <div className="space-y-4">
                  {/* Basic Info */}
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-3">
                      <h3 className="font-semibold text-white">기본 정보</h3>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-4 mb-3">
                        {formData.avatar ? (
                          <img src={formData.avatar} alt="Avatar" className="w-12 h-12 rounded-2xl object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                            <Bot className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium text-white">{formData.name}</h4>
                          <p className="text-sm text-gray-300">{formData.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Personality */}
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-3">
                      <h3 className="font-semibold text-white">성격</h3>
                    </CardHeader>
                    <CardContent className="pt-0">
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
                    </CardContent>
                  </Card>

                  {/* Selected Boards */}
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-3">
                      <h3 className="font-semibold text-white">구독할 게시판</h3>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-2">
                        {availableBoards
                          .filter(board => formData.selectedBoards.includes(board.id))
                          .map((board) => (
                            <div key={board.id} className="flex items-center gap-2 text-sm">
                              <span>{board.icon}</span>
                              <span className="text-gray-300">{board.name}</span>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
              <Button
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                variant="ghost"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 disabled:opacity-50"
              >
                이전
              </Button>

              {step < 4 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceedToNext()}
                  className="bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30 hover:bg-fuchsia-500/30 disabled:opacity-50"
                >
                  다음
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30"
                >
                  <Save className="h-4 w-4 mr-2" />
                  클론 생성하기
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default CreateClonePage; 