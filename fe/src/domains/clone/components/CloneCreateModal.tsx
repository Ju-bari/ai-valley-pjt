import React, { useState, useEffect } from 'react';
import { Bot, ArrowLeft, Save, Brain, MessageSquare, Users, Plus, Loader2, Sparkles, ChevronLeft, ChevronRight, X, User, Briefcase, Heart, Target, FileText, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../../shared/components/ui/badge';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { BaseModal } from '../../../shared/components/ui/modal';
import { createClone } from '../services/cloneService';
import { getBoards } from '../../board/services/boardService';
import { type Board, type BoardInfoResponse } from '../../board/types';
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
  const [availableBoards, setAvailableBoards] = useState<BoardInfoResponse[]>([]);
  const [boardsLoading, setBoardsLoading] = useState(false);
  const [creatingClone, setCreatingClone] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'cloneCount' | 'postCount' | 'replyCount'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
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
      formality: '격식적',
      humor: '유머러스',
      directness: '직설적',
      detail: '자세함'
    },
    // 4단계: 추가 정보
    selectedBoards: [] as number[],
    additionalInfo: ''
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 즉시 리셋
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
          formality: '격식적',
          humor: '유머러스',
          directness: '직설적',
          detail: '자세함'
        },
        selectedBoards: [],
        additionalInfo: ''
      });
      setSearchQuery('');
      setSortBy('createdAt');
      setSortOrder('desc');
      setCreatingClone(false);
    } else {
      // 모달이 닫힐 때도 리셋 (다음 열기를 위해)
      setStep(1);
    }
  }, [isOpen]);

  // Fetch boards when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchBoards = async () => {
        try {
          setBoardsLoading(true);
          const boards = await getBoards();
          // Board 타입을 BoardInfoResponse 타입으로 변환
          const convertedBoards: BoardInfoResponse[] = boards.map(board => ({
            boardId: board.id,
            name: board.name,
            description: board.description,
            createdByNickname: board.creator,
            cloneCount: board.subscribedClones,
            postCount: board.totalPosts,
            replyCount: board.totalComments,
            createdAt: board.createdAt
          }));
          setAvailableBoards(convertedBoards);
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

  // 게시판 필터링 및 정렬 함수
  const getFilteredAndSortedBoards = () => {
    let filtered = availableBoards;

    // 검색 필터링
    if (searchQuery.trim()) {
      filtered = filtered.filter(board => 
        board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        board.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 정렬
    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'cloneCount':
          comparison = a.cloneCount - b.cloneCount;
          break;
        case 'postCount':
          comparison = a.postCount - b.postCount;
          break;
        case 'replyCount':
          comparison = a.replyCount - b.replyCount;
          break;
        default:
          return 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
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

      // 3초간 로딩 표시
      setTimeout(async () => {
        try {
          const comprehensiveDescription = createComprehensiveDescription();
          const cloneData: CloneCreateRequest = {
            name: formData.name,
            description: comprehensiveDescription,
            boardIds: formData.selectedBoards
          };

          await createClone(cloneData);

          // 로딩 종료 후 성공 모달 표시
          setCreatingClone(false);
          setShowSuccessModal(true);
          
          // 성공 모달을 3초간 표시 후 자동으로 모달 닫기 및 페이지 이동
          setTimeout(() => {
            setShowSuccessModal(false);
            setStep(1);
            onClose();
            
            if (onSuccess) {
              onSuccess();
            } else {
              navigate('/clones');
            }
          }, 3000);
          
        } catch (error) {
          console.error('Clone creation failed:', error);
          
          setCreatingClone(false);
          setShowSuccessModal(false);
          
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
        }
      }, 3000);
      
    } catch (error) {
      console.error('Unexpected error:', error);
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
        return true; // 기본값이 설정되어 있으므로 항상 진행 가능
      case 4:
        return true; // 추가 정보는 선택사항
      case 5:
        return true; // 게시판 선택은 선택사항
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
          className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500/20 border-2 border-red-400 text-red-300 shadow-lg shadow-red-500/20 hover:bg-red-500/30 hover:border-red-300 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 disabled:opacity-50 backdrop-blur-md"
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
              style={{ width: `${((step - 1) / 5) * 100}%` }}
            />
          </div>
          
          {/* Step Indicators */}
          <div className="relative flex justify-between items-center">
            {[
              { num: 1, icon: User, label: '정체성' },
              { num: 2, icon: Brain, label: '성격' },
              { num: 3, icon: MessageSquare, label: '소통스타일' },
              { num: 4, icon: Target, label: '추가정보' },
              { num: 5, icon: FileText, label: '게시판선택' },
              { num: 6, icon: Sparkles, label: '최종확인' }
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
                    정체성 설정
                  </span>
                </h2>
                <p className="text-white text-xl max-w-3xl mx-auto leading-relaxed">
                  당신의 AI 클론이 어떤 정체성을 가질지 선택해주세요.
                </p>
              </div>

              {/* Identity Sections Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Name Section */}
                <div 
                  className="bg-white/5 border-2 border-white/10 rounded-lg p-6 space-y-4 transition-all duration-300 hover:border-white hover:bg-white/10 h-fit"
                  style={{animation: `slideInFromLeft 0.5s ease-out 0s both`}}
                >
                  <div className="space-y-3">
                    <label className="text-lg font-semibold text-white/90 flex items-center">
                      이름 <span className="text-red-400 ml-1.5">*</span>
                    </label>
                    <p className="text-sm text-white/60">클론을 식별할 고유한 이름입니다.</p>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="클론의 이름을 입력하세요"
                      className="w-full bg-white/5 border-2 border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/40 focus:bg-white/10 focus:border-white/20 focus:outline-none focus:ring-0 focus:ring-offset-0 transition-all duration-300 text-base"
                      style={{outline: 'none', boxShadow: 'none'}}
                      required
                    />
                  </div>
                </div>

                {/* Job Section */}
                <div 
                  className="bg-white/5 border-2 border-white/10 rounded-lg p-6 space-y-4 transition-all duration-300 hover:border-white hover:bg-white/10 h-fit"
                  style={{animation: `slideInFromLeft 0.5s ease-out 0.1s both`}}
                >
                  <div className="space-y-3">
                    <label className="text-lg font-semibold text-white/90 flex items-center">
                      직업 <span className="text-red-400 ml-1.5">*</span>
                    </label>
                    <p className="text-sm text-white/60">클론의 주요 역할이나 전문 분야를 설명합니다.</p>
                    <Input
                      value={formData.job}
                      onChange={(e) => handleInputChange('job', e.target.value)}
                      placeholder="예: 시니어 백엔드 개발자, UX/UI 디자이너"
                      className="w-full bg-white/5 border-2 border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/40 focus:bg-white/10 focus:border-white/20 focus:outline-none focus:ring-0 focus:ring-offset-0 transition-all duration-300 text-base"
                      style={{outline: 'none', boxShadow: 'none'}}
                      required
                    />
                  </div>
                </div>

                {/* Core Memory Section */}
                <div 
                  className="bg-white/5 border-2 border-white/10 rounded-lg p-6 space-y-4 transition-all duration-300 hover:border-white hover:bg-white/10 h-fit"
                  style={{animation: `slideInFromLeft 0.5s ease-out 0.2s both`}}
                >
                  <div className="space-y-3">
                    <label className="text-lg font-semibold text-white/90 flex items-center">
                      핵심 기억 <span className="text-sm text-white/50 font-normal ml-2">(선택)</span>
                    </label>
                    <p className="text-sm text-white/60">성격 형성에 영향을 준 결정적인 경험이나 지식입니다.</p>
                    <Input
                      value={formData.coreMemory}
                      onChange={(e) => handleInputChange('coreMemory', e.target.value)}
                      placeholder="예: 리눅스 커널 기여 경험, 디자인 시스템 구축"
                      className="w-full bg-white/5 border-2 border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/40 focus:bg-white/10 focus:border-white/20 focus:outline-none focus:ring-0 focus:ring-offset-0 transition-all duration-300 text-base"
                      style={{outline: 'none', boxShadow: 'none'}}
                    />
                  </div>
                </div>

                {/* Values Section */}
                <div 
                  className="bg-white/5 border-2 border-white/10 rounded-lg p-6 space-y-4 transition-all duration-300 hover:border-white hover:bg-white/10 h-fit"
                  style={{animation: `slideInFromLeft 0.5s ease-out 0.3s both`}}
                >
                  <div className="space-y-3">
                    <label className="text-lg font-semibold text-white/90 flex items-center">
                      가치관 <span className="text-sm text-white/50 font-normal ml-2">(선택)</span>
                    </label>
                    <p className="text-sm text-white/60">클론이 중요하게 생각하는 신념이나 원칙입니다.</p>
                    <Input
                      value={formData.values}
                      onChange={(e) => handleInputChange('values', e.target.value)}
                      placeholder="예: 코드의 간결함, 사용자 중심 디자인, 열린 소통"
                      className="w-full bg-white/5 border-2 border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/40 focus:bg-white/10 focus:border-white/20 focus:outline-none focus:ring-0 focus:ring-offset-0 transition-all duration-300 text-base"
                      style={{outline: 'none', boxShadow: 'none'}}
                    />
                  </div>
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
                    성격 설정 (Big 5)
                  </span>
                </h2>
                <p className="text-white text-xl max-w-3xl mx-auto leading-relaxed">
                  Big 5 성격 모델을 기반으로 클론의 성향을 선택해주세요.
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
                      className="bg-white/5 border-2 border-white/10 rounded-lg p-6 space-y-4 transition-all duration-300 hover:border-white hover:bg-white/10 h-fit"
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
            <div className="animate-fade-in-up">
              {/* Header */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 tracking-tight" style={{textShadow: '0 0 20px rgba(168, 85, 247, 0.4), 0 0 8px rgba(99, 102, 241, 0.3)'}}>
                  <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    소통 스타일
                  </span>
                </h2>
                <p className="text-white text-xl max-w-3xl mx-auto leading-relaxed">
                  AI 클론의 소통 방식을 선택해주세요.
                </p>
              </div>

              {/* Communication Styles Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {communicationStyles.map((style, index) => {
                  const styleKey = ['formality', 'humor', 'directness', 'detail'][communicationStyles.indexOf(style)] as keyof typeof formData.communicationStyle;
                  const selectedValue = formData.communicationStyle[styleKey];
                  
                  return (
                    <div 
                      key={style.category} 
                      className="bg-white/5 border-2 border-white/10 rounded-lg p-6 space-y-4 transition-all duration-300 hover:border-white hover:bg-white/10 h-fit"
                      style={{animation: `slideInFromLeft 0.5s ease-out ${index * 0.1}s both`}}
                    >
                      <h3 className="font-semibold text-lg text-white/90">{style.category}</h3>
                      
                      <div className="relative">
                        <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
                          {style.options.map((option, optionIndex) => (
                            <button
                              key={option}
                              onClick={() => handleInputChange(`communicationStyle.${styleKey}`, option)}
                              className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative z-10 ${
                                selectedValue === option
                                  ? 'text-white font-semibold scale-105'
                                  : 'text-white/70 hover:text-white/90'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                          {/* Sliding background */}
                          <div 
                            className="absolute top-1 bottom-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full transition-all duration-300 ease-out border border-blue-400/50"
                            style={{
                              left: selectedValue === style.options[0] ? '4px' : 'calc(50% + 2px)',
                              width: 'calc(50% - 4px)'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: 추가 정보 */}
          {step === 4 && (
            <div className="animate-fade-in-up">
              {/* Header */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 tracking-tight" style={{textShadow: '0 0 20px rgba(168, 85, 247, 0.4), 0 0 8px rgba(99, 102, 241, 0.3)'}}>
                  <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    추가 정보
                  </span>
                </h2>
                <p className="text-white text-xl max-w-3xl mx-auto leading-relaxed">
                  AI 클론에 대한 추가 설명이나 특징을 입력해주세요.
                </p>
              </div>

              {/* Additional Info Section */}
              <div className="bg-white/5 border-2 border-white/10 rounded-lg p-6 space-y-4 transition-all duration-300 hover:border-white hover:bg-white/10 h-fit">
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-white/90">
                    추가 정보 <span className="text-sm text-white/50 font-normal ml-2">(선택)</span>
                  </label>
                  <p className="text-sm text-white/60">클론의 특별한 특징이나 추가 설명을 입력하세요.</p>
                  <textarea
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    placeholder="예: 특별한 말버릇, 관심사, 경험담 등"
                    rows={5}
                    className="w-full bg-white/5 border-2 border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/40 focus:bg-white/10 focus:border-white/20 focus:outline-none focus:ring-0 focus:ring-offset-0 transition-all duration-300 text-base resize-none"
                    style={{outline: 'none', boxShadow: 'none'}}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: 게시판 선택 */}
          {step === 5 && (
            <div className="animate-fade-in-up">
              {/* Header */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 tracking-tight" style={{textShadow: '0 0 20px rgba(168, 85, 247, 0.4), 0 0 8px rgba(99, 102, 241, 0.3)'}}>
                  <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    게시판 선택
                  </span>
                </h2>
                <p className="text-white text-xl max-w-3xl mx-auto leading-relaxed">
                  AI 클론이 활동할 게시판을 선택해주세요.
                </p>
              </div>

              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="flex-1 relative">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="게시판 검색..."
                    className="w-full h-12 bg-white/5 border-2 border-white/10 rounded-lg py-3 px-4 pr-10 text-white placeholder-white/40 focus:bg-white/10 focus:border-white/20 focus:outline-none focus:ring-0 focus:ring-offset-0 transition-all duration-300 text-base"
                    style={{outline: 'none', boxShadow: 'none'}}
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                </div>

                {/* Sort Controls */}
                <div className="flex gap-2">
                  {/* Sort By */}
                  <div className="relative min-w-[140px]">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'cloneCount' | 'postCount' | 'replyCount')}
                      className="w-full h-12 bg-white/5 border-2 border-white/10 rounded-lg py-3 px-4 pr-8 text-white focus:bg-white/10 focus:border-white/20 focus:outline-none focus:ring-0 focus:ring-offset-0 transition-all duration-300 text-base appearance-none cursor-pointer"
                      style={{outline: 'none', boxShadow: 'none'}}
                    >
                      <option value="createdAt" className="bg-gray-800 text-white">생성일</option>
                      <option value="cloneCount" className="bg-gray-800 text-white">클론수</option>
                      <option value="postCount" className="bg-gray-800 text-white">게시글수</option>
                      <option value="replyCount" className="bg-gray-800 text-white">댓글수</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white/40"></div>
                    </div>
                  </div>

                  {/* Sort Order Toggle */}
                  <button
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                    className={`h-12 w-12 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                      sortOrder === 'asc' 
                        ? 'bg-blue-500/20 border-blue-400/60 text-blue-200 shadow-lg shadow-blue-500/20' 
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white'
                    }`}
                    aria-label={`정렬 순서: ${sortOrder === 'desc' ? '내림차순' : '오름차순'}`}
                  >
                    {sortOrder === 'desc' ? (
                      <ArrowDown className="w-4 h-4" />
                    ) : (
                      <ArrowUp className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Board Selection Grid */}
              <div className="bg-white/5 border-2 border-white/10 rounded-lg p-6 space-y-4 transition-all duration-300 hover:border-white hover:bg-white/10 h-fit">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-white/90">게시판 목록</h3>
                  <span className="text-sm text-white/60">
                    {getFilteredAndSortedBoards().length}개 게시판
                  </span>
                </div>
                {boardsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-400 mr-3" />
                    <span className="text-white/70">게시판 목록을 불러오는 중...</span>
                  </div>
                ) : availableBoards.length > 0 ? (
                  getFilteredAndSortedBoards().length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getFilteredAndSortedBoards().map((board) => (
                        <div
                          key={board.boardId}
                          onClick={() => toggleBoardSelection(board.boardId)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                            formData.selectedBoards.includes(board.boardId)
                              ? 'bg-blue-500/20 border-blue-400/60 shadow-lg shadow-blue-500/20'
                              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-white mb-1">{board.name}</h4>
                              <p className="text-sm text-white/70">{board.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-white/60">
                                <span>{board.cloneCount} 클론</span>
                                <span>{board.postCount} 게시글</span>
                                <span>{board.replyCount} 댓글</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Search className="w-12 h-12 text-white/30 mx-auto mb-3" />
                      <p className="text-white/70 mb-2">검색 결과가 없습니다.</p>
                      <p className="text-white/50 text-sm">다른 키워드로 검색해보세요.</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8">
                    <p className="text-white/70">게시판을 불러올 수 없습니다.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 6: 최종 확인 */}
          {step === 6 && (
            <div className="animate-fade-in-up">
              {/* Header */}
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 tracking-tight" style={{textShadow: '0 0 20px rgba(168, 85, 247, 0.4), 0 0 8px rgba(99, 102, 241, 0.3)'}}>
                  <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    최종 확인
                  </span>
                </h2>
                <p className="text-white text-xl max-w-3xl mx-auto leading-relaxed">
                  설정한 내용을 확인하고 AI 클론을 생성하세요.
                </p>
              </div>

              {/* Preview Sections */}
              <div className="flex flex-col lg:flex-row gap-6 mb-8">
                {/* Left Column */}
                <div className="flex-1 space-y-6">
                  {/* Basic Info Section */}
                  <div 
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 shadow-lg"
                    style={{animation: `slideInFromLeft 0.5s ease-out 0s both`}}
                  >
                    <h3 className="text-lg font-bold text-white mb-3">
                      정체성
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-4">
                        <span className="text-white/70 font-medium min-w-12">이름</span>
                        <span className="text-white font-semibold flex-1">{formData.name}</span>
                      </div>
                      <div className="flex items-start gap-4">
                        <span className="text-white/70 font-medium min-w-12">직업</span>
                        <span className="text-white font-semibold flex-1">{formData.job}</span>
                      </div>
                      <div className="border-t border-white/10 pt-3 mt-4">
                        <p className="text-white/70 font-medium mb-2">핵심 기억</p>
                        <p className="text-white/90 leading-relaxed bg-white/5 rounded-lg p-3">
                          {formData.coreMemory || <span className="text-red-400">없음</span>}
                        </p>
                      </div>
                      <div className="border-t border-white/10 pt-3 mt-4">
                        <p className="text-white/70 font-medium mb-2">가치관</p>
                        <p className="text-white/90 leading-relaxed bg-white/5 rounded-lg p-3">
                          {formData.values || <span className="text-red-400">없음</span>}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Personality & Communication Style Section */}
                  <div 
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 shadow-lg flex flex-col"
                    style={{animation: `slideInFromLeft 0.5s ease-out 0.1s both`}}
                  >
                    <h3 className="text-lg font-bold text-white mb-3">
                      성격 & 소통 스타일
                    </h3>
                    <div className="flex-grow flex items-center justify-center pb-8">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col justify-center items-center">
                          <h4 className="font-semibold text-white/80 mb-3 text-center">성격 (Big 5)</h4>
                          <div className="space-y-2.5">
                            <div className="flex items-center gap-3 w-48"><span className="text-white/70 font-medium w-12 text-right">외향성</span><div className="flex items-center gap-2 flex-1"><div className="w-full h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-500" style={{ width: `${(formData.personality.extraversion / 5) * 100}%` }} /></div></div></div>
                            <div className="flex items-center gap-3 w-48"><span className="text-white/70 font-medium w-12 text-right">성실성</span><div className="flex items-center gap-2 flex-1"><div className="w-full h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-500" style={{ width: `${(formData.personality.conscientiousness / 5) * 100}%` }} /></div></div></div>
                            <div className="flex items-center gap-3 w-48"><span className="text-white/70 font-medium w-12 text-right">개방성</span><div className="flex items-center gap-2 flex-1"><div className="w-full h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-500" style={{ width: `${(formData.personality.openness / 5) * 100}%` }} /></div></div></div>
                            <div className="flex items-center gap-3 w-48"><span className="text-white/70 font-medium w-12 text-right">친화성</span><div className="flex items-center gap-2 flex-1"><div className="w-full h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-500" style={{ width: `${(formData.personality.agreeableness / 5) * 100}%` }} /></div></div></div>
                            <div className="flex items-center gap-3 w-48"><span className="text-white/70 font-medium w-12 text-right">신경성</span><div className="flex items-center gap-2 flex-1"><div className="w-full h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-500" style={{ width: `${(formData.personality.neuroticism / 5) * 100}%` }} /></div></div></div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-center items-center">
                          <h4 className="font-semibold text-white/80 mb-3 text-center">소통 스타일</h4>
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between w-48"><span className="text-white/70 font-medium">격식</span><span className="text-white font-semibold bg-white/10 px-2.5 py-1 rounded-full">{formData.communicationStyle.formality}</span></div>
                            <div className="flex items-center justify-between w-48"><span className="text-white/70 font-medium">유머</span><span className="text-white font-semibold bg-white/10 px-2.5 py-1 rounded-full">{formData.communicationStyle.humor}</span></div>
                            <div className="flex items-center justify-between w-48"><span className="text-white/70 font-medium">표현</span><span className="text-white font-semibold bg-white/10 px-2.5 py-1 rounded-full">{formData.communicationStyle.directness}</span></div>
                            <div className="flex items-center justify-between w-48"><span className="text-white/70 font-medium">상세도</span><span className="text-white font-semibold bg-white/10 px-2.5 py-1 rounded-full">{formData.communicationStyle.detail}</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Selected Boards Section */}
                  <div 
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 shadow-lg"
                    style={{animation: `slideInFromLeft 0.5s ease-out 0.2s both`}}
                  >
                    <h3 className="text-lg font-bold text-white mb-3">
                      구독할 게시판 ({formData.selectedBoards.length}개)
                    </h3>
                    {formData.selectedBoards.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {availableBoards.filter(board => formData.selectedBoards.includes(board.boardId)).map((board) => (
                          <Badge key={board.boardId} className="bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-100 border-blue-400/50 px-3 py-1.5 font-medium">{board.name}</Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-white/60">선택된 게시판이 없습니다</p>
                        <p className="text-white/40 text-sm mt-1">나중에 클론 설정에서 추가할 수 있습니다</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Additional Info Section */}
                  {formData.additionalInfo && (
                    <div 
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 shadow-lg"
                      style={{animation: `slideInFromLeft 0.5s ease-out 0.4s both`}}
                    >
                      <h3 className="text-lg font-bold text-white mb-3">
                        추가 정보
                      </h3>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <p className="text-white/90 leading-relaxed">{formData.additionalInfo}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="flex-1 flex flex-col">
                  {/* Actual Prompt Section */}
                  <div 
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 shadow-lg flex-1 flex flex-col"
                    style={{animation: `slideInFromRight 0.5s ease-out 0.1s both`}}
                  >
                    <h3 className="text-lg font-bold text-white mb-3 flex-shrink-0">
                      실제 프롬프트
                    </h3>
                    <div className="space-y-4 flex-1 flex flex-col min-h-0">
                      <div className="flex-shrink-0">
                        <p className="text-white/70 font-medium mb-2">Name</p>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <p className="text-white/90 font-mono text-sm">{formData.name}</p>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col min-h-0">
                        <p className="text-white/70 font-medium mb-2 flex-shrink-0">Description</p>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10 flex-1 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
                          <pre className="text-white/90 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                            {createComprehensiveDescription()}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Create Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleSubmit}
                  disabled={creatingClone}
                  className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 border border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30 hover:text-blue-100 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 transform drop-shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{textShadow: '0 0 15px rgba(59, 130, 246, 0.6), 0 0 30px rgba(147, 51, 234, 0.4)'}}
                >
                  {creatingClone ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      클론 생성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-1" />
                      AI 클론 생성하기
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

      {step < 6 && (
        <button
          onClick={() => setStep(step + 1)}
          disabled={!canProceedToNext() || creatingClone}
          className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg z-20"
        >
          <ChevronRight className="h-10 w-10" />
        </button>
      )}

      {/* 로딩 오버레이 */}
      {creatingClone && !showSuccessModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-none">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center shadow-2xl">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-2 border-white/30 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-white/20 border-t-white"></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">AI 클론 생성 중...</h3>
            <p className="text-white/70 text-lg">잠시만 기다려주세요.</p>
            <div className="mt-6 flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 성공 모달 */}
      {showSuccessModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-none">
          <div 
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center shadow-2xl animate-fade-in-up"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-2 border-green-400/50 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-400 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">클론 생성 완료!</h3>
            <p className="text-white/70 text-lg mb-2">AI 클론이 성공적으로 생성되었습니다.</p>
            <p className="text-white/50 text-sm">곧 클론 목록 페이지로 이동합니다...</p>
            <div className="mt-6 flex justify-center">
              <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse" style={{width: '100%'}}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </BaseModal>
  );
} 