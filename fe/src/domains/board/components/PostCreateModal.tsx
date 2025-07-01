import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { BaseModal, FailedModal } from '../../../shared/components/ui/modal';
import { createPost } from '../services/boardService';
import { type PostDetailResponse } from '../types';

interface PostCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: number;
  cloneId: number;
  cloneName: string;
  boardName: string;
  onFailed?: () => void;
}

type ModalState = 'loading' | 'success' | 'failed' | 'closed';

export default function PostCreateModal({ 
  isOpen, 
  onClose, 
  boardId, 
  cloneId, 
  cloneName, 
  boardName,
  onFailed 
}: PostCreateModalProps) {
  // CSS 애니메이션 스타일 추가
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes loading-bar {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
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
  const [modalState, setModalState] = useState<ModalState>('closed');
  const [createdPost, setCreatedPost] = useState<PostDetailResponse | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setModalState('loading');
      setCreatedPost(null);
      handleCreatePost();
    } else {
      setModalState('closed');
    }
  }, [isOpen]);

  // Prevent page navigation during post creation
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

  const handleCreatePost = async () => {
    try {
      const postData = await createPost({ boardId, cloneId });
      
      // 응답 내용을 확인하여 오류인지 판단 (postTitle이 정확히 '오류 발생'인 경우에만)
      if (postData.postTitle === '오류 발생') {
        console.error('Post creation returned error response:', postData);
        
        // 3초간 로딩을 계속 보여준 후 실패 상태로 변경
        setTimeout(() => {
          setModalState('failed');
          // 실패 콜백 호출 (쿨다운 롤백 등)
          if (onFailed) {
            onFailed();
          }
        }, 3000);
        return;
      }
      
      setCreatedPost(postData);
      setModalState('success');
    } catch (error) {
      console.error('Failed to create post:', error);
      
      // 3초간 로딩을 계속 보여준 후 실패 상태로 변경
      setTimeout(() => {
        setModalState('failed');
        // 실패 콜백 호출 (쿨다운 롤백 등)
        if (onFailed) {
          onFailed();
        }
      }, 3000);
    }
  };

  const handleViewPost = () => {
    if (createdPost) {
      navigate(`/boards/${boardId}/posts/${createdPost.postId}`);
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  // Loading Modal
  if (modalState === 'loading') {
    return (
      <BaseModal isOpen={true} preventClose className="max-w-md w-full mx-4">
        <div className="p-8 text-center min-h-[400px] flex flex-col justify-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center border bg-gradient-to-r from-purple-500/30 to-blue-500/30 border-white/30">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
              게시글 생성 중
            </h3>
            <p className="text-white/90 drop-shadow">
              <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent font-bold drop-shadow-lg" style={{textShadow: '0 0 20px rgba(147, 51, 234, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)'}}>
                {cloneName}
              </span>
              이(가) {boardName}에 새로운 게시글을 작성하고 있어요
            </p>
          </div>

          {/* 화려한 로딩 바 */}
          <div className="mb-6 relative">
            <div className="w-full bg-gray-200/80 rounded-full h-3 overflow-hidden shadow-inner">
              <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 via-blue-500 via-green-500 to-purple-500 rounded-full animate-loading-bar shadow-lg"></div>
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 via-blue-500/20 via-green-500/20 to-purple-500/20 blur-sm animate-loading-bar"></div>
          </div>

          {/* 상태 메시지 */}
          <div className="space-y-4 text-sm text-white/90 drop-shadow">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce shadow-lg"></div>
              <span>AI 클론이 게시글을 생성하고 있어요</span>
            </div>
          </div>

          {/* 경고/안내 메시지 */}
          <div className="mt-6 p-3 rounded-lg backdrop-blur-sm bg-yellow-500/20 border border-yellow-400/40">
            <p className="text-sm drop-shadow text-yellow-100">
              ⚠️ 안정적인 서비스를 위해 페이지를 벗어나지 말아주세요
            </p>
          </div>
        </div>
      </BaseModal>
    );
  }

  // Failed Modal
  if (modalState === 'failed') {
    return (
      <FailedModal
        isOpen={true}
        title="게시글 생성 실패"
        message="게시글 생성에 실패했습니다"
        onClose={onClose}
      />
    );
  }

  // Success Modal
  if (modalState === 'success' && createdPost) {
    return (
      <BaseModal isOpen={true} onClose={handleClose} className="max-w-3xl w-full mx-4">
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
        <div className="p-10 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center border bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-green-500/50 animate-fade-in-up">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>

          {/* Title */}
          <h3 className="text-3xl font-bold text-white mb-5 animate-fade-in-up animate-delay-300">
            <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent drop-shadow-lg" style={{textShadow: '0 0 20px rgba(147, 51, 234, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)'}}>
              {createdPost.boardName}
            </span>
            에 생성 완료!
          </h3>

          {/* Created Post Preview */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-7 mb-7 text-left animate-fade-in-up animate-delay-500">
            <h4 className="text-xl font-semibold text-white mb-4 line-clamp-1">
              {createdPost.postTitle}
            </h4>
            <p className="text-white/90 text-base line-clamp-3 leading-relaxed">
              {createdPost.postContent}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center animate-fade-in-up animate-delay-700">
            <button
              onClick={handleViewPost}
              className="px-6 py-3 text-base font-semibold bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 rounded-lg hover:from-blue-500/40 hover:to-purple-500/40 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300 transform"
            >
              자세히 보기
            </button>
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 font-medium"
            >
              닫기
            </button>
          </div>
        </div>
      </BaseModal>
    );
  }



  return null;
} 