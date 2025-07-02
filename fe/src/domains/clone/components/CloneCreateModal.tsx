import React, { useState, useEffect } from 'react';
import { Bot, ArrowLeft, Save, Brain, MessageSquare, Users, Plus, Loader2, Sparkles, ChevronLeft, ChevronRight, X, User, Briefcase, Heart, Target, FileText, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../../shared/components/ui/badge';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { BaseModal, FailedModal } from '../../../shared/components/ui/modal';
import { createClone } from '../services/cloneService';
import { getBoards } from '../../board/services/boardService';
import { type Board, type BoardInfoResponse } from '../../board/types';
import { type CloneCreateRequest } from '../types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../@/components/ui/select';

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

type ModalState = 'form' | 'loading' | 'success' | 'failed';

export default function CloneCreateModal({ isOpen, onClose, onSuccess }: CloneCreateModalProps) {
  // CSS 애니메이션 스타일 추가
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes loading-bar {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      @keyframes gradientMove {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      .animate-loading-bar {
        animation: loading-bar 2s linear infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const navigate = useNavigate();
  const [modalState, setModalState] = useState<ModalState>('form');
  const [step, setStep] = useState(1);
  const [availableBoards, setAvailableBoards] = useState<BoardInfoResponse[]>([]);
  const [boardsLoading, setBoardsLoading] = useState(false);
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

  // Prevent page navigation during clone creation
  useEffect(() => {
    if (modalState === 'loading') {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '안정적인 서비스를 위해 페이지에 머물러 주세요';
      };

      const handlePopState = (e: PopStateEvent) => {
        e.preventDefault();
        window.history.pushState(null, '', window.location.href);
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);
      
      // Push current state to prevent back navigation
      window.history.pushState(null, '', window.location.href);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [modalState]);

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
      setModalState('form');
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
    } else {
      // 모달이 닫힐 때도 리셋 (다음 열기를 위해)
      setModalState('form');
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
      setModalState('loading');

      // 5초간 로딩 표시
      setTimeout(async () => {
        try {
          const comprehensiveDescription = createComprehensiveDescription();
          const cloneData: CloneCreateRequest = {
            name: formData.name,
            description: comprehensiveDescription,
            boardIds: formData.selectedBoards
          };

          await createClone(cloneData);
          setModalState('success');
          
        } catch (error) {
          console.error('Clone creation failed:', error);
          
          // 3초간 로딩을 계속 보여준 후 실패 상태로 변경
          setTimeout(() => {
            setModalState('failed');
          }, 3000);
        }
      }, 5000);
      
    } catch (error) {
      console.error('Unexpected error:', error);
      setModalState('failed');
    }
  };

  const handleGoBack = () => {
    setModalState('form');
    setStep(1);
    onClose();
    
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/clones');
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
    <BaseModal isOpen={isOpen} onClose={onClose} preventClose={modalState === 'loading'} className="w-screen h-screen max-w-none max-h-none m-0 rounded-none flex flex-col">
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
              visibility: hidden;
            }
            100% {
              opacity: 1;
              transform: translateX(0);
              visibility: visible;
            }
          }
          
          @keyframes slideInFromRight {
            0% {
              opacity: 0;
              transform: translateX(20px);
              visibility: hidden;
            }
            100% {
              opacity: 1;
              transform: translateX(0);
              visibility: visible;
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
          
          /* 애니메이션 중 텍스트 색상 고정 */
          .card-content * {
            color: inherit !important;
          }
          
          .card-content h3 {
            color: rgb(255 255 255) !important;
          }
          
          .card-content .text-white\/70 {
            color: rgb(255 255 255 / 0.7) !important;
          }
          
          .card-content .text-white\/90 {
            color: rgb(255 255 255 / 0.9) !important;
          }
          
          .card-content .text-white\/60 {
            color: rgb(255 255 255 / 0.6) !important;
          }
          
          .card-content .text-white\/40 {
            color: rgb(255 255 255 / 0.4) !important;
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

          @keyframes firework {
            0% {
              transform: translateY(100px) scale(0.3);
              opacity: 0.2;
            }
            20% {
              transform: translateY(50px) scale(0.7);
              opacity: 0.6;
            }
            40% {
              transform: translateY(-20px) scale(1);
              opacity: 1;
            }
            60% {
              transform: translateY(-80px) scale(1.1);
              opacity: 0.9;
            }
            80% {
              transform: translateY(-150px) scale(0.8);
              opacity: 0.5;
            }
            100% {
              transform: translateY(-250px) scale(0.2);
              opacity: 0;
            }
          }

          @keyframes firework-success {
            0% {
              transform: translateY(80px) scale(0.2) rotate(0deg);
              opacity: 0.1;
            }
            25% {
              transform: translateY(20px) scale(0.6) rotate(45deg);
              opacity: 0.7;
            }
            50% {
              transform: translateY(-60px) scale(1) rotate(120deg);
              opacity: 1;
            }
            75% {
              transform: translateY(-140px) scale(0.9) rotate(200deg);
              opacity: 0.7;
            }
            100% {
              transform: translateY(-280px) scale(0.1) rotate(360deg);
              opacity: 0;
            }
          }

          .animate-firework {
            animation: firework linear infinite;
          }

          .animate-firework-success {
            animation: firework-success linear infinite;
          }

          @keyframes explode {
            0% {
              transform: scale(0.2) translateY(50px);
              opacity: 0.8;
            }
            20% {
              transform: scale(0.8) translateY(-20px);
              opacity: 1;
            }
            40% {
              transform: scale(1.1) translateY(-100px);
              opacity: 0.9;
            }
            60% {
              transform: scale(1) translateY(-180px);
              opacity: 0.7;
            }
            80% {
              transform: scale(0.6) translateY(-260px);
              opacity: 0.4;
            }
            100% {
              transform: scale(0.1) translateY(-350px);
              opacity: 0;
            }
          }

          @keyframes sparkle {
            0%, 100% {
              transform: scale(0.3) rotate(0deg);
              opacity: 0.4;
              filter: brightness(1) blur(0px);
            }
            25% {
              transform: scale(1) rotate(90deg);
              opacity: 1;
              filter: brightness(2) blur(1px);
            }
            50% {
              transform: scale(1.5) rotate(180deg);
              opacity: 0.8;
              filter: brightness(3) blur(0px);
            }
            75% {
              transform: scale(0.8) rotate(270deg);
              opacity: 0.9;
              filter: brightness(2.5) blur(1px);
            }
          }

          .animate-explode {
            animation: explode linear infinite;
          }

          .animate-sparkle {
            animation: sparkle linear infinite;
          }
        `
      }} />
      
      {/* 닫기 버튼 */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={onClose}
          disabled={modalState === 'loading'}
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
                  <div className="min-w-[140px]">
                    <Select
                      value={sortBy}
                      onValueChange={(value) => setSortBy(value as 'createdAt' | 'cloneCount' | 'postCount' | 'replyCount')}
                    >
                      <SelectTrigger className="w-full h-12 bg-white/5 border-2 border-white/10 rounded-lg px-4 text-white focus:bg-white/10 focus:border-white/20 focus:outline-none focus:ring-0 focus:ring-offset-0 transition-all duration-300 text-base flex items-center justify-between min-h-[48px] max-h-[48px] [&>span]:line-clamp-1 [&_svg]:h-4 [&_svg]:w-4">
                        <SelectValue placeholder="정렬 기준" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 rounded-lg" position="popper" side="bottom" sideOffset={5}>
                        <SelectItem value="createdAt" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 cursor-pointer">
                          생성일
                        </SelectItem>
                        <SelectItem value="cloneCount" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 cursor-pointer">
                          클론수
                        </SelectItem>
                        <SelectItem value="postCount" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 cursor-pointer">
                          게시글수
                        </SelectItem>
                        <SelectItem value="replyCount" className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 cursor-pointer">
                          댓글수
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 shadow-lg card-content"
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
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 shadow-lg flex flex-col card-content"
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
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 shadow-lg card-content"
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
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 shadow-lg card-content"
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
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 shadow-lg flex-1 flex flex-col card-content"
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
                  disabled={modalState === 'loading'}
                  className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 border border-blue-500/30 hover:from-blue-500/30 hover:to-purple-500/30 hover:text-blue-100 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 transform drop-shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{textShadow: '0 0 15px rgba(59, 130, 246, 0.6), 0 0 30px rgba(147, 51, 234, 0.4)'}}
                >
                  {modalState === 'loading' ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      클론 생성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-1" />
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
          disabled={modalState === 'loading'}
          className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg z-20"
        >
          <ChevronLeft className="h-10 w-10" />
        </button>
      )}

      {step < 6 && (
        <button
          onClick={() => setStep(step + 1)}
          disabled={!canProceedToNext() || modalState === 'loading'}
          className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg z-20"
        >
          <ChevronRight className="h-10 w-10" />
        </button>
      )}

      {/* 로딩 오버레이 */}
      {modalState === 'loading' && (
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-gray-900/90 to-black/85 backdrop-blur-xl flex items-center justify-center z-50 rounded-none overflow-hidden">
          {/* 폭죽 효과 */}
          <div className="absolute inset-0 pointer-events-none">
            {/* 기본 폭죽 */}
            {[...Array(50)].map((_, i) => (
              <div
                key={`firework-${i}`}
                className="absolute w-2 h-2 rounded-full animate-firework"
                style={{
                  backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8', '#f7dc6f'][i % 8],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${2 + Math.random() * 4}s`
                }}
              />
            ))}
            {/* 폭발 효과 */}
            {[...Array(30)].map((_, i) => (
              <div
                key={`explode-${i}`}
                className="absolute w-3 h-3 rounded-full animate-explode"
                style={{
                  backgroundColor: ['#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#10ac84', '#ee5a52', '#0abde3'][i % 8],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.3}s`,
                  animationDuration: `${1.5 + Math.random() * 3}s`,
                  boxShadow: `0 0 15px ${['#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#10ac84', '#ee5a52', '#0abde3'][i % 8]}`
                }}
              />
            ))}
            {/* 반짝이 효과 */}
            {[...Array(40)].map((_, i) => (
              <div
                key={`sparkle-${i}`}
                className="absolute w-1 h-1 rounded-full animate-sparkle"
                style={{
                  backgroundColor: ['#fff', '#ffef5b', '#ff6b6b', '#4ecdc4', '#45b7d1'][i % 5],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.2}s`,
                  animationDuration: `${1 + Math.random() * 2.5}s`,
                  boxShadow: '0 0 10px #fff'
                }}
              />
            ))}
          </div>
          <div 
            className="backdrop-blur-xl rounded-3xl border shadow-2xl border-white/40 shadow-purple-500/20 p-10 text-center min-h-[450px] flex flex-col justify-center max-w-lg w-full mx-4"
            style={{
              background: 'linear-gradient(45deg, rgba(255,255,255,0.9), rgba(147,197,253,0.85), rgba(196,181,253,0.85), rgba(255,255,255,0.9))',
              backgroundSize: '400% 400%',
              animation: 'gradientMove 4s ease infinite'
            }}
          >
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center border bg-gradient-to-r from-purple-500/30 to-blue-500/30 border-white/30">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse"></div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
                <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent" style={{textShadow: '0 0 20px rgba(147, 51, 234, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)'}}>
                  AI 클론 생성 중
                </span>
              </h3>
                             <p className="text-white/90 text-lg drop-shadow">
                 <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent font-bold drop-shadow-lg" style={{textShadow: '0 0 20px rgba(147, 51, 234, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)'}}>
                   {formData.name}
                 </span>
                 이(가) 새로운 세상으로 태어나고 있어요
               </p>
            </div>

            {/* 화려한 로딩 바 */}
            <div className="mb-8 relative">
              <div className="w-full bg-gray-200/80 rounded-full h-3 overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 via-blue-500 via-green-500 to-purple-500 rounded-full animate-loading-bar shadow-lg"></div>
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 via-blue-500/20 via-green-500/20 to-purple-500/20 blur-sm animate-loading-bar"></div>
            </div>

            {/* 상태 메시지 */}
            <div className="space-y-4 text-sm text-white/90 drop-shadow mb-6">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce shadow-lg"></div>
                <span>AI가 클론의 정체성을 학습하고 있어요</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.2s'}}></div>
                <span>성격과 소통 스타일을 분석하고 있어요</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.4s'}}></div>
                <span>게시판 구독 설정을 적용하고 있어요</span>
              </div>
            </div>

            {/* 경고/안내 메시지 */}
            <div className="p-4 rounded-lg backdrop-blur-sm bg-yellow-500/20 border border-yellow-400/40">
              <p className="text-sm drop-shadow text-yellow-100">
                ⚠️ 안정적인 서비스를 위해 페이지를 벗어나지 말아주세요
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 성공 모달 */}
      {modalState === 'success' && (
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-gray-900/90 to-black/85 backdrop-blur-xl flex items-center justify-center z-50 rounded-none overflow-hidden">
          {/* 폭죽 효과 - 더 화려하게 */}
          <div className="absolute inset-0 pointer-events-none">
            {/* 성공 폭죽 */}
            {[...Array(80)].map((_, i) => (
              <div
                key={`success-firework-${i}`}
                className="absolute w-3 h-3 rounded-full animate-firework-success"
                style={{
                  backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8', '#f7dc6f', '#ff9ff3', '#54a0ff'][i % 10],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.3}s`,
                  animationDuration: `${1.5 + Math.random() * 3}s`,
                  boxShadow: `0 0 10px ${['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8', '#f7dc6f', '#ff9ff3', '#54a0ff'][i % 10]}`
                }}
              />
            ))}
            {/* 대형 폭발 효과 */}
            {[...Array(20)].map((_, i) => (
              <div
                key={`success-explode-${i}`}
                className="absolute w-5 h-5 rounded-full animate-explode"
                style={{
                  backgroundColor: ['#00ff00', '#ffff00', '#ff00ff', '#00ffff', '#ff8000', '#8000ff'][i % 6],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.2}s`,
                  animationDuration: `${1 + Math.random() * 3}s`,
                  boxShadow: `0 0 25px ${['#00ff00', '#ffff00', '#ff00ff', '#00ffff', '#ff8000', '#8000ff'][i % 6]}`
                }}
              />
            ))}
            {/* 황금 반짝이 */}
            {[...Array(60)].map((_, i) => (
              <div
                key={`success-sparkle-${i}`}
                className="absolute w-2 h-2 rounded-full animate-sparkle"
                style={{
                  backgroundColor: ['#ffd700', '#ffef5b', '#fff', '#ff6b6b', '#4ecdc4'][i % 5],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.1}s`,
                  animationDuration: `${1.2 + Math.random() * 2.5}s`,
                  boxShadow: '0 0 20px #ffd700'
                }}
              />
            ))}
          </div>
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
              
              .animate-fade-in-up {
                animation: fadeInUp 0.6s ease-out;
              }
              
              .animate-delay-300 {
                animation-delay: 0.3s;
                animation-fill-mode: both;
              }
              
              .animate-delay-500 {
                animation-delay: 0.5s;
                animation-fill-mode: both;
              }
              
              .animate-delay-700 {
                animation-delay: 0.7s;
                animation-fill-mode: both;
              }
            `
          }} />
          <div 
            className="backdrop-blur-xl rounded-3xl border shadow-2xl border-white/40 shadow-purple-500/20 p-12 text-center max-w-2xl w-full mx-4"
            style={{
              background: 'linear-gradient(45deg, rgba(255,255,255,0.9), rgba(147,197,253,0.85), rgba(196,181,253,0.85), rgba(255,255,255,0.9))',
              backgroundSize: '400% 400%',
              animation: 'gradientMove 4s ease infinite'
            }}
          >
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center border bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-green-500/50 animate-fade-in-up">
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>

            {/* Title */}
            <h3 className="text-3xl font-bold text-white mb-8 animate-fade-in-up animate-delay-300">
              <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent drop-shadow-lg" style={{textShadow: '0 0 20px rgba(147, 51, 234, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)'}}>
                {formData.name}
              </span>
              이(가) 태어났어요!
            </h3>

                         {/* Success Message */}
             <p className="text-white/90 text-lg mb-2 animate-fade-in-up animate-delay-700">
               AI 클론이 성공적으로 생성되었습니다!
             </p>
             <p className="text-white/60 text-lg mb-8 animate-fade-in-up animate-delay-700">
               이제 클론 목록에서 새로운 클론을 확인하실 수 있습니다.
             </p>

             {/* Action Button */}
             <div className="flex justify-center animate-fade-in-up animate-delay-700">
               <button
                 onClick={handleGoBack}
                 className="px-8 py-3 text-lg font-semibold bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 rounded-lg hover:from-blue-500/40 hover:to-purple-500/40 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300 transform"
                 style={{textShadow: '0 0 15px rgba(59, 130, 246, 0.6), 0 0 30px rgba(147, 51, 234, 0.4)'}}
               >
                 돌아가기
               </button>
             </div>
          </div>
        </div>
      )}

      {/* 실패 모달 */}
      {modalState === 'failed' && (
        <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-black/85 via-gray-900/90 to-black/85 backdrop-blur-xl">
          {/* 실패 폭죽 효과 - 차분한 색상 */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-firework"
                style={{
                  backgroundColor: ['#ff7675', '#74b9ff', '#a29bfe', '#fd79a8', '#fdcb6e', '#e17055'][i % 6],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.4}s`,
                  animationDuration: `${2 + Math.random() * 4}s`,
                  opacity: 0.6
                }}
              />
            ))}
          </div>
          <FailedModal
            isOpen={true}
            title="클론 생성 실패"
            message="클론 생성에 실패했습니다"
            onClose={() => {
              setModalState('form');
              onClose();
            }}
          />
        </div>
      )}
    </BaseModal>
  );
} 