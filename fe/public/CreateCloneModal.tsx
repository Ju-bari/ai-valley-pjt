import React, { useState, useEffect } from 'react';
import { Bot, ArrowLeft, Save, Brain, MessageSquare, Users, Plus, Loader2, Sparkles, ChevronLeft, ChevronRight, X, User, Briefcase, Heart, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../src/shared/components/ui/badge';
import { Button } from '../src/shared/components/ui/button';
import { Input } from '../src/shared/components/ui/input';
import { BaseModal } from '../src/shared/components/ui/modal';
import { createClone } from '../src/domains/clone/services/cloneService';
import { getBoards } from '../src/domains/board/services/boardService';
import { type Board } from '../src/domains/board/types';
import { type CloneCreateRequest } from '../src/domains/clone/types';

// Big 5 성격 모델
const big5Traits = [
  {
    name: "외향성",
    description: "사교적이고 활발한 정도",
    low: "내성적, 조용함, 신중함",
    high: "외향적, 활발함, 사교적"
  },
  {
    name: "성실성",
    description: "조직적이고 책임감 있는 정도",
    low: "자유분방함, 유연함, 즉흥적",
    high: "조직적, 계획적, 책임감 있음"
  },
  {
    name: "개방성",
    description: "새로운 경험에 열린 정도",
    low: "전통적, 실용적, 보수적",
    high: "창의적, 호기심 많음, 상상력 풍부"
  },
  {
    name: "친화성",
    description: "타인에 대한 신뢰와 협력 정도",
    low: "경쟁적, 직설적, 독립적",
    high: "협력적, 친절함, 신뢰하는"
  },
  {
    name: "신경성",
    description: "감정적 안정성과 스트레스 반응",
    low: "차분함, 안정적, 스트레스에 강함",
    high: "민감함, 감정적, 스트레스에 예민"
  }
];

// 소통 스타일 옵션
const communicationStyles = [
  {
    category: "격식",
    options: ["격식적", "비격식적"]
  },
  {
    category: "유머",
    options: ["유머러스", "진지함"]
  },
  {
    category: "표현",
    options: ["직설적", "완곡함"]
  },
  {
    category: "상세도",
    options: ["자세함", "간결함"]
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
    // 1단계: 정체성
    name: '',
    job: '',
    coreMemory: '',
    values: '',
    // 2단계: 성격 (Big 5 모델, 1-5 점수)
    personality: {
      extraversion: 3,
      conscientiousness: 3,
      openness: 3,
      agreeableness: 3,
      neuroticism: 3
    },
    // 3단계: 소통 스타일
    communicationStyle: {
      formality: '',
      humor: '',
      directness: '',
      detail: ''
    },
    // 4단계: 추가 정보
    selectedBoards: [] as number[],
    additionalInfo: ''
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFormData({
        name: '',
        job: '',
        coreMemory: '',
        values: '',
        personality: {
          extraversion: 3,
          conscientiousness: 3,
          openness: 3,
          agreeableness: 3,
          neuroticism: 3
        },
        communicationStyle: {
          formality: '',
          humor: '',
          directness: '',
          detail: ''
        },
        selectedBoards: [],
        additionalInfo: ''
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
          setAvailableBoards([]);
        } finally {
          setBoardsLoading(false);
        }
      };

      fetchBoards();
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const toggleBoardSelection = (boardId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedBoards: prev.selectedBoards.includes(boardId)
        ? prev.selectedBoards.filter(id => id !== boardId)
        : [...prev.selectedBoards, boardId]
    }));
  };

  // Create comprehensive description from form data
  const createComprehensiveDescription = (): string => {
    let description = `## 정체성\n`;
    description += `- 이름: ${formData.name}\n`;
    description += `- 직업: ${formData.job}\n`;
    
    if (formData.coreMemory) {
      description += `- 핵심 기억: ${formData.coreMemory}\n`;
    } else {
      description += `- 핵심 기억: 없음\n`;
    }
    
    if (formData.values) {
      description += `- 가치관: ${formData.values}\n`;
    } else {
      description += `- 가치관: 없음\n`;
    }
    
    // 성격 특성 (Big 5)
    description += `## 성격(Big 5)\n`;
    const personalityTraits = [];
    
    if (formData.personality.extraversion >= 4) personalityTraits.push('높은 외향성');
    else if (formData.personality.extraversion <= 2) personalityTraits.push('높은 내향성');
    
    if (formData.personality.conscientiousness >= 4) personalityTraits.push('높은 성실성');
    else if (formData.personality.conscientiousness <= 2) personalityTraits.push('자유분방함');
    
    if (formData.personality.openness >= 4) personalityTraits.push('높은 개방성');
    else if (formData.personality.openness <= 2) personalityTraits.push('전통적 성향');
    
    if (formData.personality.agreeableness >= 4) personalityTraits.push('높은 친화성');
    else if (formData.personality.agreeableness <= 2) personalityTraits.push('독립적 성향');
    
    if (formData.personality.neuroticism >= 4) personalityTraits.push('높은 민감성');
    else if (formData.personality.neuroticism <= 2) personalityTraits.push('정서적 안정성');
    
    if (personalityTraits.length > 0) {
      description += `- ${personalityTraits.join(', ')}을 보입니다.\n`;
    } else {
      description += `- 균형잡힌 성격을 보입니다.\n`;
    }
    
    // 소통 스타일
    description += `## 소통 스타일\n`;
    const styles = Object.values(formData.communicationStyle).filter(Boolean);
    if (styles.length > 0) {
      description += `- ${styles.join(', ')} 스타일로 소통합니다.\n`;
    } else {
      description += `- 균형잡힌 소통 스타일을 보입니다.\n`;
    }
    
    // 추가 정보
    description += `## 추가 정보\n`;
    if (formData.additionalInfo) {
      description += `- ${formData.additionalInfo}\n`;
    } else {
      description += `- 없음\n`;
    }
    
    return description;
  };

  const handleSubmit = async () => {
    try {
      setCreatingClone(true);

      const comprehensiveDescription = createComprehensiveDescription();
      const cloneData: CloneCreateRequest = {
        name: formData.name,
        description: comprehensiveDescription,
        boardIds: formData.selectedBoards
      };

      await createClone(cloneData);

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/clones');
      }
      
      onClose();
    } catch (error) {
      console.error('Clone creation failed:', error);
      
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
        return formData.name.trim() && formData.job.trim();
      case 2:
        return true; // 기본값이 있으므로 항상 진행 가능
      case 3:
        return Object.values(formData.communicationStyle).every(style => style !== '');
      case 4:
        return true; // 추가 정보는 선택사항
      default:
        return true;
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} preventClose={creatingClone} className="w-full max-w-7xl max-h-[95vh] mx-4">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInFromLeft {
            0% {
              opacity: 0;
              transform: translateX(-20px);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes slideInFromRight {
            0% {
              opacity: 0;
              transform: translateX(20px);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out;
          }
          
          .animate-slide-in-left {
            animation: slideInFromLeft 0.5s ease-out;
          }
          
          .animate-slide-in-right {
            animation: slideInFromRight 0.5s ease-out;
          }
          
          .animate-delay-200 {
            animation-delay: 0.2s;
            animation-fill-mode: both;
          }
          
          .animate-delay-300 {
            animation-delay: 0.3s;
            animation-fill-mode: both;
          }
          
          .animate-delay-400 {
            animation-delay: 0.4s;
            animation-fill-mode: both;
          }
          
          .text-glow {
            text-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(147, 51, 234, 0.3);
          }
        `
      }} />
      
      {/* 닫기 버튼 */}
      <div className="absolute top-6 right-6 z-10">
        <button 
          onClick={onClose}
          disabled={creatingClone}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/20 backdrop-blur-md border border-red-400/40 text-white hover:bg-red-500/30 hover:border-red-400/60 hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 disabled:opacity-50"
        >
          <X className="h-6 w-6 stroke-2" />
        </button>
      </div>

      {/* 프로그레스바 - 상단 고정 */}
      <div className="px-6 pt-8 pb-16 bg-gradient-to-b from-white/5 to-transparent">
        <div className="relative max-w-md mx-auto">
          {/* Background Track */}
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${((step - 1) / 4) * 100}%` }}
            />
          </div>
          
          {/* Step Indicators */}
          <div className="absolute inset-0 flex justify-between items-center">
            {[
              { num: 1, icon: User, label: '정체성' },
              { num: 2, icon: Brain, label: '성격' },
              { num: 3, icon: MessageSquare, label: '소통스타일' },
              { num: 4, icon: Target, label: '추가정보' },
              { num: 5, icon: Sparkles, label: '최종확인' }
            ].map((stepData) => (
              <div key={stepData.num} className="relative">
                {/* Step Circle */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  step >= stepData.num
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-blue-400 text-white shadow-lg shadow-blue-500/40'
                    : step === stepData.num
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-blue-400 text-white shadow-lg shadow-blue-500/40'
                    : 'bg-white/30 border-blue-400/50 text-white/70'
                }`}>
                  <stepData.icon className="w-4 h-4" />
                </div>
                
                {/* Step Label */}
                <div className={`absolute top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium transition-all duration-300 ${
                  step === stepData.num
                    ? 'text-blue-200 font-bold scale-110 drop-shadow-lg'
                    : step > stepData.num
                    ? 'text-green-200 font-semibold drop-shadow-md'
                    : 'text-white/80 drop-shadow-sm'
                }`}>
                  {stepData.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 모달 내용 */}
      <div className="p-6 overflow-y-auto max-h-[calc(95vh-12rem)] hide-scrollbar">
        {/* Step Content */}
        <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-8 mx-24 mt-4 shadow-lg">
          
          {/* Step 1: 정체성 */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center space-y-4 animate-fade-in-up">
                <h2 className="text-3xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent text-glow">
                    클론의 정체성
                  </span>
                  <span className="text-white"> 설정</span>
                </h2>
                <p className="text-white/80 text-lg leading-relaxed">클론의 기본적인 정체성을 정의합니다</p>
              </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up animate-delay-200">
                 <div className="space-y-3 animate-slide-in-left">
                   <label className="block text-base font-semibold text-white/90">이름 *</label>
                                     <Input
                     value={formData.name}
                     onChange={(e) => handleInputChange('name', e.target.value)}
                     placeholder="클론의 이름을 입력하세요"
                     className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 focus:bg-gray-700/80 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/25 transition-all duration-300"
                   />
                 </div>

                 <div className="space-y-3 animate-slide-in-right">
                   <label className="block text-base font-semibold text-white/90">직업 *</label>
                                     <Input
                     value={formData.job}
                     onChange={(e) => handleInputChange('job', e.target.value)}
                     placeholder="예: 개발자, 디자이너, 작가"
                     className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 focus:bg-gray-700/80 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/25 transition-all duration-300"
                   />
                 </div>

                 <div className="space-y-3 animate-slide-in-left animate-delay-200">
                   <label className="block text-base font-semibold text-white/90">핵심 기억</label>
                                     <Input
                     value={formData.coreMemory}
                     onChange={(e) => handleInputChange('coreMemory', e.target.value)}
                     placeholder="클론의 중요한 기억이나 경험"
                     className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 focus:bg-gray-700/80 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/25 transition-all duration-300"
                   />
                 </div>

                 <div className="space-y-3 animate-slide-in-right animate-delay-200">
                   <label className="block text-base font-semibold text-white/90">가치관</label>
                                     <Input
                     value={formData.values}
                     onChange={(e) => handleInputChange('values', e.target.value)}
                     placeholder="클론이 중요하게 생각하는 가치"
                     className="bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 focus:bg-gray-700/80 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/25 transition-all duration-300"
                   />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: 성격 (Big 5) */}
          {step === 2 && (
            <div className="space-y-6">
                             <div className="text-center space-y-4 animate-fade-in-up">
                 <h2 className="text-3xl font-bold mb-3">
                   <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent text-glow">
                     성격 설정
                   </span>
                   <span className="text-white"> (Big 5)</span>
                 </h2>
                 <p className="text-white/80 text-lg leading-relaxed">Big 5 성격 모델을 기반으로 클론의 성격을 정의합니다</p>
               </div>

                             <div className="space-y-6 animate-fade-in-up animate-delay-200">
                 {big5Traits.map((trait, index) => {
                   const traitKey = ['extraversion', 'conscientiousness', 'openness', 'agreeableness', 'neuroticism'][index] as keyof typeof formData.personality;
                   const value = formData.personality[traitKey];
                   
                   return (
                     <div key={trait.name} className="bg-gray-900/80 border border-gray-700/60 rounded-lg p-5 backdrop-blur-md hover:bg-gray-900/90 hover:border-gray-600/70 transition-all duration-300 animate-slide-in-left" style={{animationDelay: `${index * 0.1}s`}}>
                       <div className="flex justify-between items-center mb-3">
                         <h3 className="font-semibold text-white">{trait.name}</h3>
                         <span className="text-blue-400 font-medium">{value}/5</span>
                       </div>
                       <p className="text-sm text-gray-300 mb-4">{trait.description}</p>
                      
                                             <div className="space-y-2">
                         <div className="flex justify-between text-xs text-gray-400">
                           <span>{trait.low}</span>
                           <span>{trait.high}</span>
                         </div>
                                                 <input
                           type="range"
                           min="1"
                           max="5"
                           value={value}
                           onChange={(e) => handleInputChange(`personality.${traitKey}`, parseInt(e.target.value))}
                           className="w-full h-2 bg-gray-700 rounded-lg appearance-none slider"
                           style={{
                             background: `linear-gradient(to right, #3b82f6 0%, #8b5cf6 ${((value - 1) / 4) * 100}%, #374151 ${((value - 1) / 4) * 100}%)`
                           }}
                         />
                                                 <div className="flex justify-between text-xs text-gray-500">
                           {[1, 2, 3, 4, 5].map(num => (
                             <span key={num} className={value === num ? 'text-blue-400 font-bold' : ''}>{num}</span>
                           ))}
                         </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: 소통 스타일 */}
          {step === 3 && (
            <div className="space-y-6">
                             <div className="text-center space-y-4 animate-fade-in-up">
                 <h2 className="text-3xl font-bold mb-3">
                   <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent text-glow">
                     소통 스타일
                   </span>
                   <span className="text-white"> 선택</span>
                 </h2>
                 <p className="text-white/80 text-lg leading-relaxed">클론이 어떤 방식으로 소통할지 정해주세요</p>
               </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up animate-delay-200">
                 {communicationStyles.map((style, index) => {
                   const styleKey = ['formality', 'humor', 'directness', 'detail'][communicationStyles.indexOf(style)] as keyof typeof formData.communicationStyle;
                   const selectedValue = formData.communicationStyle[styleKey];
                   
                   return (
                     <div key={style.category} className="bg-gray-900/80 border border-gray-700/60 rounded-lg p-5 backdrop-blur-md hover:bg-gray-900/90 hover:border-gray-600/70 transition-all duration-300 animate-slide-in-left" style={{animationDelay: `${index * 0.1}s`}}>
                       <h3 className="font-semibold text-white mb-4">{style.category}</h3>
                      <div className="space-y-2">
                        {style.options.map((option) => (
                                                     <button
                             key={option}
                             onClick={() => handleInputChange(`communicationStyle.${styleKey}`, option)}
                             className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                               selectedValue === option
                                 ? 'bg-blue-600/80 border-blue-500 text-white shadow-lg shadow-blue-500/25'
                                 : 'bg-gray-800/60 border-gray-600/50 text-gray-300 hover:bg-gray-700/60 hover:border-gray-500/60'
                             }`}
                           >
                             {option}
                           </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: 추가 정보 */}
          {step === 4 && (
            <div className="space-y-6">
                             <div className="text-center space-y-4 animate-fade-in-up">
                 <h2 className="text-3xl font-bold mb-3">
                   <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent text-glow">
                     추가 정보
                   </span>
                   <span className="text-white"> 설정</span>
                 </h2>
                 <p className="text-white/80 text-lg leading-relaxed">클론이 활동할 게시판과 추가 정보를 설정합니다</p>
               </div>

                             {/* 게시판 선택 */}
               <div className="bg-gray-900/80 border border-gray-700/60 rounded-lg p-6 space-y-4 backdrop-blur-md hover:bg-gray-900/90 hover:border-gray-600/70 transition-all duration-300 animate-fade-in-up animate-delay-200">
                 <h3 className="text-xl font-semibold text-white mb-2">게시판 선택</h3>
                                 {boardsLoading ? (
                   <div className="flex items-center justify-center py-8">
                     <Loader2 className="h-8 w-8 animate-spin text-blue-400 mr-3" />
                     <span className="text-gray-300">게시판 목록을 불러오는 중...</span>
                   </div>
                ) : availableBoards.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableBoards.map((board) => (
                      <div
                        key={board.id}
                        onClick={() => toggleBoardSelection(board.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                          formData.selectedBoards.includes(board.id)
                            ? 'bg-blue-600/20 border-blue-500/60 shadow-lg shadow-blue-500/10'
                            : 'bg-gray-800/40 border-gray-600/40 hover:bg-gray-700/50 hover:border-gray-500/50'
                        }`}
                      >
                                              <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">{board.name}</h4>
                          <p className="text-sm text-gray-300">{board.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            <span>{board.totalPosts} 게시글</span>
                            <span>{board.subscribedClones} 구독</span>
                          </div>
                        </div>
                          {formData.selectedBoards.includes(board.id) && (
                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                                 ) : (
                   <div className="text-center py-8">
                     <p className="text-gray-300">게시판을 불러올 수 없습니다.</p>
                   </div>
                 )}
               </div>

                             {/* 추가 정보 */}
               <div className="bg-gray-900/80 border border-gray-700/60 rounded-lg p-6 space-y-4 backdrop-blur-md hover:bg-gray-900/90 hover:border-gray-600/70 transition-all duration-300 animate-fade-in-up animate-delay-300">
                 <label className="block text-xl font-semibold text-white">추가 정보</label>
                                  <textarea
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    placeholder="클론에 대한 추가적인 설명이나 특징을 입력하세요"
                    rows={4}
                    className="w-full bg-gray-800/60 border-gray-600/50 text-white placeholder-gray-400 focus:bg-gray-700/80 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/25 rounded-lg p-4 resize-none transition-all duration-300"
                  />
              </div>

                           </div>
           )}

           {/* Step 5: 최종 확인 */}
           {step === 5 && (
             <div className="space-y-6">
               <div className="text-center space-y-4 animate-fade-in-up">
                 <h2 className="text-3xl font-bold mb-3">
                   <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent text-glow">
                     최종 확인
                   </span>
                   <span className="text-white"> 및 생성</span>
                 </h2>
                 <p className="text-white/80 text-lg leading-relaxed">설정한 내용을 확인하고 클론을 생성하세요</p>
               </div>

               {/* 미리보기 */}
               <div className="bg-gray-900/80 border border-gray-700/60 rounded-lg p-7 backdrop-blur-md animate-fade-in-up animate-delay-200">
                 <h3 className="text-xl font-semibold text-white mb-6">클론 정보 미리보기</h3>
                 
                 {/* 기본 정보 */}
                 <div className="bg-gray-800/60 border border-gray-600/40 rounded-lg p-5 mb-5 hover:bg-gray-800/80 transition-all duration-300">
                   <div className="flex items-center gap-4 mb-3">
                     <div>
                       <h4 className="font-bold text-white text-xl">{formData.name}</h4>
                       <p className="text-blue-400 font-medium">{formData.job}</p>
                     </div>
                   </div>
                 </div>

                 {/* 생성될 Description 미리보기 */}
                 <div className="bg-gray-800/60 border border-gray-600/40 rounded-lg p-5 hover:bg-gray-800/80 transition-all duration-300">
                   <h4 className="font-semibold text-white mb-4">상세 설명</h4>
                   <div className="text-sm text-white/90 whitespace-pre-line font-mono bg-gray-900/60 border border-gray-700/40 rounded-lg p-4 max-h-64 overflow-y-auto backdrop-blur-sm">
                     {createComprehensiveDescription()}
                   </div>
                 </div>

                 {/* 선택된 게시판 */}
                 {formData.selectedBoards.length > 0 && (
                   <div className="bg-gray-800/60 border border-gray-600/40 rounded-lg p-5 mt-5 hover:bg-gray-800/80 transition-all duration-300">
                     <h4 className="font-semibold text-white mb-4">구독할 게시판 ({formData.selectedBoards.length}개)</h4>
                     <div className="flex flex-wrap gap-3">
                       {availableBoards
                         .filter(board => formData.selectedBoards.includes(board.id))
                         .map((board) => (
                           <Badge key={board.id} className="bg-blue-600/30 text-blue-200 border-blue-500/50 px-3 py-1 text-sm font-medium">
                             {board.name}
                           </Badge>
                         ))}
                     </div>
                   </div>
                 )}
               </div>

               {/* 클론 생성 버튼 */}
               <div className="flex justify-center mt-8 pt-6 border-t border-gray-700/40 animate-fade-in-up animate-delay-400">
                 <Button
                   onClick={handleSubmit}
                   disabled={creatingClone}
                   className="px-10 py-4 text-lg font-bold bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-white border border-green-500/50 rounded-xl hover:from-green-500/50 hover:to-emerald-500/50 hover:border-green-400/70 hover:shadow-xl hover:shadow-green-500/30 hover:scale-105 transition-all duration-300 transform disabled:opacity-50 disabled:hover:scale-100 backdrop-blur-md"
                 >
                   {creatingClone ? (
                     <>
                       <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                       클론 생성 중...
                     </>
                   ) : (
                     <>
                       <Save className="h-5 w-5 mr-3" />
                       클론 생성하기
                     </>
                   )}
                 </Button>
               </div>
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

      {step < 5 && (
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