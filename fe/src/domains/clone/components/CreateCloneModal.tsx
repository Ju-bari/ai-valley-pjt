import React, { useState, useEffect } from 'react';
import { Bot, ArrowLeft, Save, Brain, MessageSquare, Users, Plus, Loader2, Sparkles, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../../shared/components/ui/badge';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { BaseModal } from '../../../shared/components/ui/modal';
import { createClone } from '../services/cloneService';
import { getBoards } from '../../board/services/boardService';
import { type Board } from '../../board/types';
import { type CloneCreateRequest } from '../types';

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

interface CreateCloneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateCloneModal({ isOpen, onClose, onSuccess }: CreateCloneModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [availableBoards, setAvailableBoards] = useState<Board[]>([]);
  const [boardsLoading, setBoardsLoading] = useState(false);
  const [creatingClone, setCreatingClone] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    personalityTemplate: null as number | null,
    selectedBoards: [] as number[],
    customTraits: [] as string[],
    newTrait: ''
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFormData({
        name: '',
        personalityTemplate: null,
        selectedBoards: [],
        customTraits: [],
        newTrait: ''
      });
      setCreatingClone(false);
    }
  }, [isOpen]);

  // Fetch boards when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchBoards = async () => {
        try {
          setBoardsLoading(true);
          const boards = await getBoards();
          setAvailableBoards(boards);
        } catch (error) {
          console.error('Failed to fetch boards:', error);
          // Fallback to empty array if API fails
          setAvailableBoards([]);
        } finally {
          setBoardsLoading(false);
        }
      };

      fetchBoards();
    }
  }, [isOpen]);

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
    
    let description = `${formData.name}은(는) AI Valley에서 활동하는 AI 클론입니다.`;
    
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

      // Success callback
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/clones');
      }
      
      onClose();
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
        return formData.name.trim();
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
    <BaseModal isOpen={isOpen} onClose={onClose} preventClose={creatingClone} className="w-full max-w-7xl max-h-[95vh] mx-4">
              {/* 닫기 버튼 */}
        <div className="absolute top-6 right-6 z-10">
          <button 
            onClick={onClose}
            disabled={creatingClone}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500/40 backdrop-blur-sm border border-red-400/80 text-white hover:bg-red-500/50 hover:border-red-400/90 hover:text-white transition-all duration-300 disabled:opacity-50 shadow-lg"
          >
            <X className="h-5 w-5 stroke-2" />
          </button>
        </div>

                              {/* 프로그레스바 - 상단 고정 */}
        <div className="px-6 pt-8 pb-16 bg-gradient-to-b from-white/5 to-transparent">
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
                  <div className={`absolute top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium transition-all duration-300 ${
                    step === stepData.num
                      ? 'text-fuchsia-200 font-bold scale-110 drop-shadow-lg'
                      : step > stepData.num
                      ? 'text-green-200 font-semibold drop-shadow-md'
                      : 'text-white/80 drop-shadow-sm'
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
        </div>

        {/* 모달 내용 */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-12rem)] hide-scrollbar">

          {/* Step Content */}
          <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-8 mx-24 mt-4 shadow-lg">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-fuchsia-500/30 to-purple-500/30 flex items-center justify-center mb-6">
                  <Bot className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white drop-shadow-lg">클론 이름을 정해주세요</h2>
                <p className="text-white/90 text-lg">나만의 AI 클론에게 특별한 이름을 지어주세요</p>
              </div>

              {/* Name Input - 중앙 배치 */}
              <div className="w-full max-w-md space-y-3">
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="클론 이름을 입력하세요"
                  className="bg-white/25 border-white/40 text-white placeholder-white/70 focus:bg-white/30 focus:border-white/50 text-center text-xl py-4 rounded-xl"
                />
                <p className="text-center text-white/70 text-sm">
                  예: 도움이, AI 비서, 창작 도우미
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Personality Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <p className="text-center text-white text-lg font-medium mb-8 drop-shadow-sm">클론의 성격 유형을 선택해주세요</p>

              {/* Personality Templates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalityTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleInputChange('personalityTemplate', template.id)}
                                          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        formData.personalityTemplate === template.id
                          ? 'bg-fuchsia-500/30 border-fuchsia-500/60'
                          : 'bg-white/15 border-white/25 hover:bg-white/20'
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
                                          <label className="block text-base font-semibold text-white mb-2 drop-shadow-sm">추가 특성 (선택사항)</label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={formData.newTrait}
                      onChange={(e) => handleInputChange('newTrait', e.target.value)}
                      placeholder="예: 유머러스한"
                      className="bg-white/25 border-white/40 text-white placeholder-white/70 focus:bg-white/30 focus:border-white/50"
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
              <p className="text-center text-white text-lg font-medium mb-8 drop-shadow-sm">클론이 활동할 게시판을 선택해주세요</p>

              {boardsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-fuchsia-400 mr-3" />
                  <span className="text-white">게시판 목록을 불러오는 중...</span>
                </div>
              ) : availableBoards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableBoards.map((board) => (
                    <div
                      key={board.id}
                      onClick={() => toggleBoardSelection(board.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        formData.selectedBoards.includes(board.id)
                          ? 'bg-fuchsia-500/30 border-fuchsia-500/60'
                          : 'bg-white/15 border-white/25 hover:bg-white/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-blue-300" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">{board.name}</h3>
                          <p className="text-sm text-white/90">{board.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-white/80">
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
                  <p className="text-white">게시판을 불러올 수 없습니다.</p>
                </div>
              )}

              <div className="text-center text-sm text-white">
                {formData.selectedBoards.length}개의 게시판이 선택되었습니다
              </div>
            </div>
          )}

          {/* Step 4: Final Review */}
          {step === 4 && (
            <div className="space-y-6">
              <p className="text-center text-white text-lg font-medium mb-8 drop-shadow-sm">설정한 내용을 확인하고 클론을 생성하세요</p>

              {/* Review Summary */}
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="bg-white/15 border-white/25 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-3">기본 정보</h3>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/30 flex items-center justify-center">
                      <Bot className="h-6 w-6 text-white/80" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{formData.name}</h4>
                      <p className="text-sm text-white/90">AI Valley에서 활동하는 AI 클론</p>
                    </div>
                  </div>
                </div>

                {/* Personality */}
                <div className="bg-white/15 border-white/25 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-3">성격</h3>
                  {selectedTemplate && (
                    <div>
                      <h4 className="font-medium text-white mb-2">{selectedTemplate.name}</h4>
                      <div className="flex flex-wrap gap-2">
                        {[...selectedTemplate.traits, ...formData.customTraits].map((trait) => (
                          <Badge key={trait} className="bg-purple-500/30 text-purple-200 border-purple-500/40">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Boards */}
                <div className="bg-white/15 border-white/25 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-3">구독할 게시판</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {availableBoards
                      .filter(board => formData.selectedBoards.includes(board.id))
                      .map((board) => (
                        <div key={board.id} className="flex items-center gap-2 text-sm">
                          <MessageSquare className="h-4 w-4 text-blue-300" />
                          <span className="text-white">{board.name}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 클론 생성 버튼 (4단계일 때만) */}
          {step === 4 && (
            <div className="flex justify-center mt-8 pt-6 border-t border-white/10">
              <Button
                onClick={handleSubmit}
                disabled={creatingClone}
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white border border-green-500/30 hover:from-green-500/40 hover:to-emerald-500/40 hover:border-green-400/50 hover:shadow-lg hover:shadow-green-500/25 hover:scale-105 transition-all duration-300 transform disabled:opacity-50 disabled:hover:scale-100"
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
            </div>
          )}
        </div>

      </div>

             {/* 모달 내부 좌우 네비게이션 화살표 */}
       {step > 1 && (
         <button
           onClick={() => setStep(step - 1)}
           disabled={creatingClone}
           className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg z-20"
         >
           <ChevronLeft className="h-10 w-10" />
         </button>
       )}

       {step < 4 && (
         <button
           onClick={() => setStep(step + 1)}
           disabled={!canProceedToNext() || creatingClone}
           className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg z-20"
         >
           <ChevronRight className="h-10 w-10" />
         </button>
       )}
    </BaseModal>
  );
} 