import React, { useState, useEffect } from 'react';
import { Bot, ArrowLeft, Save, Brain, MessageSquare, Users, Plus, Loader2, Sparkles, ChevronLeft, ChevronRight, X, User, Briefcase, Heart, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../../shared/components/ui/badge';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { BaseModal } from '../../../shared/components/ui/modal';
import { createClone } from '../services/cloneService';
import { getBoards } from '../../board/services/boardService';
import { type Board } from '../../board/types';
import { type CloneCreateRequest } from '../types';

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

interface CloneCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CloneCreateModal({ isOpen, onClose, onSuccess }: CloneCreateModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [availableBoards, setAvailableBoards] = useState<Board[]>([]);
  const [boardsLoading, setBoardsLoading] = useState(false);
  const [creatingClone, setCreatingClone] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      const originalValue = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalValue;
      };
    }
  }, [isOpen]);

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
    <BaseModal isOpen={isOpen} onClose={onClose} preventClose={creatingClone} className="w-screen h-screen max-w-none max-h-none m-0 rounded-none flex flex-col">
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
          
          .slider-thumb::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: #a78bfa;
            border-radius: 50%;
            border: 3px solid #f0f2f5;
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
            cursor: pointer;
          }

          .slider-thumb::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #a78bfa;
            border-radius: 50%;
            border: 3px solid #f0f2f5;
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
            cursor: pointer;
            border: none;
          }

          .slider-thumb::-moz-range-track {
            background: transparent;
            border: none;
          }
        `
      }} />
      
      {/* 닫기 버튼 */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={onClose}
          disabled={creatingClone}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-red-300/30 to-red-400/30 border-2 border-red-300/60 text-red-200 shadow-lg shadow-red-300/20 hover:from-red-300/40 hover:to-red-400/40 hover:border-red-300/80 hover:shadow-xl hover:shadow-red-300/30 transition-all duration-300 disabled:opacity-50 backdrop-blur-md"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* 프로그레스바 - 상단 고정 */}
      <div className="px-8 pt-6 pb-6 bg-gradient-to-b from-purple-900/30 via-blue-900/10 to-transparent">
        <div className="relative max-w-2xl mx-auto">

          {/* Background Track */}
          <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-6 backdrop-blur-sm border border-white/20">
            <div 
              className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${((step - 1) / 4) * 100}%` }}
            />
          </div>
          
          {/* Step Indicators */}
          <div className="relative flex justify-between items-center">
            {[
              { num: 1, icon: User, label: '정체성' },
              { num: 2, icon: Brain, label: '성격' },
              { num: 3, icon: MessageSquare, label: '소통스타일' },
              { num: 4, icon: Target, label: '추가정보' },
              { num: 5, icon: Sparkles, label: '최종확인' }
            ].map((stepData) => {
              const isCompleted = step > stepData.num;
              const isCurrent = step === stepData.num;
              
              let circleClasses = '';
              let labelClasses = '';
              let statusText = '대기중';

              if (isCompleted) {
                circleClasses = 'bg-green-500/20 border-green-400 text-green-300 shadow-green-500/20';
                labelClasses = 'text-green-300 font-medium';
                statusText = '완료';
              } else if (isCurrent) {
                circleClasses = 'bg-red-500/20 border-red-400 text-red-300 shadow-red-500/20';
                labelClasses = 'text-red-200 font-bold scale-105';
                statusText = '진행중';
              } else { // isUpcoming
                circleClasses = 'bg-gray-700/50 border-gray-500 text-gray-400';
                labelClasses = 'text-white/80';
              }

              return (
                <div key={stepData.num} className="relative flex flex-col items-center">
                  {/* Step Circle */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-lg transition-all duration-500 ${circleClasses}`}>
                    <stepData.icon className="w-5 h-5" />
                  </div>
                  
                  {/* Step Label */}
                  <div className={`mt-3 text-center transition-all duration-300 ${labelClasses}`}>
                    <div className="text-sm font-medium whitespace-nowrap">{stepData.label}</div>
                    <div className="text-xs opacity-80 mt-1">{statusText}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 모달 내용 */}
      <div className="px-6 pb-6 overflow-y-auto flex-1 hide-scrollbar">
        {/* Step Content */}
        <div className="bg-gray-900/60 backdrop-blur-2xl border border-white/20 rounded-3xl p-12 mx-auto max-w-7xl shadow-2xl">
          
          {/* Step 1: 정체성 */}
          {step === 1 && (
            <div className="animate-fade-in-up">
              {/* Header */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 tracking-tight" style={{textShadow: '0 0 20px rgba(168, 85, 247, 0.4), 0 0 8px rgba(99, 102, 241, 0.3)'}}>
                  <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    클론의 정체성 설정
                  </span>
                </h2>
                <p className="text-white text-xl max-w-3xl mx-auto leading-relaxed">
                  당신의 AI 클론이 어떤 정체성을 가질지 정의해주세요.
                </p>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                {/* Name Input */}
                <div className="space-y-3 animate-slide-in-left">
                  <label className="text-lg font-semibold text-white/90 flex items-center">
                    이름 <span className="text-red-400 ml-1.5">*</span>
                  </label>
                  <p className="text-sm text-white/60 !mt-1.5">클론을 식별할 고유한 이름입니다.</p>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="클론의 이름을 입력하세요"
                    className="w-full bg-white/5 border-2 border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/40 focus:bg-white/10 focus:border-white/20 transition-all duration-300 text-base"
                    required
                  />
                </div>

                {/* Job Input */}
                <div className="space-y-3 animate-slide-in-right">
                  <label className="text-lg font-semibold text-white/90 flex items-center">
                    직업 <span className="text-red-400 ml-1.5">*</span>
                  </label>
                  <p className="text-sm text-white/60 !mt-1.5">클론의 주요 역할이나 전문 분야를 설명합니다.</p>
                  <Input
                    value={formData.job}
                    onChange={(e) => handleInputChange('job', e.target.value)}
                    placeholder="예: 시니어 백엔드 개발자, UX/UI 디자이너"
                    className="w-full bg-white/5 border-2 border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/40 focus:bg-white/10 focus:border-white/20 transition-all duration-300 text-base"
                    required
                  />
                </div>

                {/* Core Memory Input */}
                <div className="space-y-3 animate-slide-in-left animate-delay-200">
                  <label className="text-lg font-semibold text-white/90 flex items-center">
                    핵심 기억 <span className="text-sm text-white/50 font-normal ml-2">(선택)</span>
                  </label>
                  <p className="text-sm text-white/60 !mt-1.5">성격 형성에 영향을 준 결정적인 경험이나 지식입니다.</p>
                  <Input
                    value={formData.coreMemory}
                    onChange={(e) => handleInputChange('coreMemory', e.target.value)}
                    placeholder="예: 리눅스 커널 기여 경험, 디자인 시스템 구축"
                    className="w-full bg-white/5 border-2 border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/40 focus:bg-white/10 focus:border-white/20 transition-all duration-300 text-base"
                  />
                </div>

                {/* Values Input */}
                <div className="space-y-3 animate-slide-in-right animate-delay-200">
                  <label className="text-lg font-semibold text-white/90 flex items-center">
                    가치관 <span className="text-sm text-white/50 font-normal ml-2">(선택)</span>
                  </label>
                  <p className="text-sm text-white/60 !mt-1.5">클론이 중요하게 생각하는 신념이나 원칙입니다.</p>
                  <Input
                    value={formData.values}
                    onChange={(e) => handleInputChange('values', e.target.value)}
                    placeholder="예: 코드의 간결함, 사용자 중심 디자인, 열린 소통"
                    className="w-full bg-white/5 border-2 border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/40 focus:bg-white/10 focus:border-white/20 transition-all duration-300 text-base"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: 성격 (Big 5) */}
          {step === 2 && (
            <div className="animate-fade-in-up">
              {/* Header */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 tracking-tight" style={{textShadow: '0 0 20px rgba(168, 85, 247, 0.4), 0 0 8px rgba(99, 102, 241, 0.3)'}}>
                  <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    클론의 성격 설정 (Big 5)
                  </span>
                </h2>
                <p className="text-white text-xl max-w-3xl mx-auto leading-relaxed">
                  Big 5 성격 모델을 기반으로 클론의 성향을 정의합니다.
                </p>
              </div>

              {/* Traits Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {big5Traits.map((trait, index) => {
                  const traitKey = ['extraversion', 'conscientiousness', 'openness', 'agreeableness', 'neuroticism'][index] as keyof typeof formData.personality;
                  const value = formData.personality[traitKey];
                  
                  return (
                    <div 
                      key={trait.name} 
                      className="bg-white/5 border-2 border-white/10 rounded-lg p-6 space-y-4 transition-all duration-300 hover:border-white hover:bg-white/10"
                      style={{animation: `slideInFromLeft 0.5s ease-out ${index * 0.1}s both`}}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg text-white/90">{trait.name}</h3>
                          <span className="text-sm text-white/60">{trait.description}</span>
                        </div>
                        <span className="font-bold text-xl text-blue-300">{value}</span>
                      </div>
                      
                      <div className="pt-2">
                        <div className="relative h-8 flex items-center">
                          {/* Background Track */}
                          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-600/70 rounded-full -translate-y-1/2 pointer-events-none">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${((value - 1) / 4) * 100}%` }}
                            />
                          </div>
                          
                          {/* Step Lines & Click Areas */}
                          <div className="absolute top-1/2 left-0 w-full -translate-y-1/2">
                            {[1, 2, 3, 4, 5].map((num, index) => (
                              <div 
                                key={num} 
                                className="absolute flex justify-center items-center" 
                                style={{ left: `${(index / 4) * 100}%`, transform: 'translateX(-50%) translateY(-35%)' }}
                              >
                                <button 
                                  onClick={() => handleInputChange(`personality.${traitKey}`, num)}
                                  className="absolute -inset-3 z-20"
                                />
                                <div className={`h-3 w-0.5 rounded-full transition-colors duration-500 ${value >= num ? 'bg-blue-300' : 'bg-gray-500'}`} />
                              </div>
                            ))}
                          </div>

                          {/* Custom Thumb */}
                          <div 
                            className="absolute top-1/2 w-4 h-4 bg-purple-400 border-2 border-white rounded-full shadow-lg pointer-events-none z-30 transition-all duration-500 ease-out"
                            style={{ 
                              left: `${((value - 1) / 4) * 100}%`,
                              transform: 'translateX(-50%) translateY(-50%)'
                            }}
                          />

                          {/* Hidden Input for interaction */}
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={value}
                            onChange={(e) => handleInputChange(`personality.${traitKey}`, parseInt(e.target.value))}
                            className="w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer opacity-0 relative z-10"
                          />
                        </div>

                        <div className="flex justify-between text-sm mt-2">
                          <span className={`transition-all duration-300 ${
                            value <= 2 
                              ? 'text-white font-semibold scale-105' 
                              : value === 3 
                                ? 'text-white/70' 
                                : 'text-white/50'
                          }`}>
                            {trait.low}
                          </span>
                          <span className={`transition-all duration-300 ${
                            value >= 4 
                              ? 'text-white font-semibold scale-105' 
                              : value === 3 
                                ? 'text-white/70' 
                                : 'text-white/50'
                          }`}>
                            {trait.high}
                          </span>
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
                   <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent drop-shadow-lg" style={{textShadow: '0 0 20px rgba(147, 51, 234, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)'}}>
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
                   <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent drop-shadow-lg" style={{textShadow: '0 0 20px rgba(147, 51, 234, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)'}}>
                     추가 정보
                   </span>
                   <span className="text-white"> 설정</span>
                 </h2>
                 <p className="text-white/80 text-lg leading-relaxed">클론이 활동할 게시판과 추가 정보를 설정합니다</p>
               </div>

                             {/* 게시판 선택 */}
               <div className="bg-gray-900/80 border border-gray-700/60 rounded-lg p-6 space-y-4 backdrop-blur-md hover:bg-gray-900/90 hover:border-gray-600/70 transition-all duration-300 animate-fade-in-up animate-delay-200">
                 <h3 className="text-xl font-semibold text-white mb-2">활동할 게시판 선택</h3>
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
                   <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent drop-shadow-lg" style={{textShadow: '0 0 20px rgba(147, 51, 234, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)'}}>
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