import React from 'react';
import { Loader2 } from 'lucide-react';

interface BaseModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
  preventClose?: boolean;
}

export function BaseModal({ isOpen, onClose, children, className = '', preventClose = false }: BaseModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !preventClose && onClose) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-500/20 via-blue-500/15 to-pink-500/20 backdrop-blur-xl"
      onClick={handleBackdropClick}
    >
      <div 
        className={`relative backdrop-blur-xl rounded-3xl border shadow-2xl transition-all duration-700 ease-in-out border-white/40 shadow-purple-500/20 ${className}`}
        style={{
          background: 'linear-gradient(45deg, rgba(255,255,255,0.3), rgba(147,197,253,0.4), rgba(196,181,253,0.4), rgba(255,255,255,0.3))',
          backgroundSize: '400% 400%',
          animation: 'gradientMove 4s ease infinite'
        }}
      >
        {children}
      </div>
    </div>
  );
}

interface LoadingModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  showProgress?: boolean;
}

interface FailedModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export function LoadingModal({ isOpen, title, message, showProgress = true }: LoadingModalProps) {
  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} preventClose className="max-w-md w-full mx-4">
      <div className="p-8 text-center min-h-[400px] flex flex-col justify-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center border bg-gradient-to-r from-purple-500/30 to-blue-500/30 border-white/30">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse"></div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
            {title}
          </h3>
          <p className="text-white/90 drop-shadow">
            {message}
          </p>
        </div>

        {/* 화려한 로딩 바 */}
        {showProgress && (
          <div className="mb-6 relative">
            <div className="w-full bg-gray-200/80 rounded-full h-3 overflow-hidden shadow-inner">
              <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 via-blue-500 via-green-500 to-purple-500 rounded-full animate-loading-bar shadow-lg"></div>
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 via-blue-500/20 via-green-500/20 to-purple-500/20 blur-sm animate-loading-bar"></div>
          </div>
        )}

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

export function FailedModal({ isOpen, title, message, onClose }: FailedModalProps) {
  if (!isOpen) return null;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} className="max-w-md w-full mx-4 border-red-400/60">
      <style dangerouslySetInnerHTML={{
        __html: `
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
          
          @keyframes fadeInScale {
            0% {
              opacity: 0;
              transform: scale(0.8);
            }
            100% {
              opacity: 1;
              transform: scale(1);
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
          
          .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out;
          }
          
          .animate-fade-in-scale {
            animation: fadeInScale 0.5s ease-out;
          }
          
          .animate-slide-in-left {
            animation: slideInLeft 0.7s ease-out;
          }
          
          .animate-bounce-in {
            animation: bounceIn 0.8s ease-out;
          }
          
          .animate-delay-200 {
            animation-delay: 0.2s;
            animation-fill-mode: both;
          }
          
          .animate-delay-400 {
            animation-delay: 0.4s;
            animation-fill-mode: both;
          }
          
          .animate-delay-600 {
            animation-delay: 0.6s;
            animation-fill-mode: both;
          }
        `
      }} />
      <div 
        className="p-8 text-center rounded-3xl min-h-[400px] flex flex-col justify-center"
        style={{
          background: 'linear-gradient(45deg, rgba(239,68,68,0.3), rgba(220,38,38,0.4), rgba(185,28,28,0.3), rgba(239,68,68,0.3))',
          backgroundSize: '400% 400%',
          animation: 'gradientMove 4s ease infinite'
        }}
      >
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center border bg-gradient-to-r from-red-500/30 to-red-600/30 border-red-400/40 animate-bounce-in">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-400 to-red-500"></div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg animate-fade-in-up animate-delay-200">
            {title}
          </h3>
          <p className="text-white/90 drop-shadow animate-fade-in-up animate-delay-400">
            {message}
          </p>
        </div>

        {/* 상태 메시지 */}
        <div className="mb-6 space-y-4 text-sm text-white/90 drop-shadow animate-slide-in-left animate-delay-600">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full shadow-lg"></div>
            <span>네트워크 연결을 확인하시고 잠시 후 다시 시도해주세요</span>
          </div>
        </div>

        {/* 닫기 버튼 */}
        <div className="mt-6 animate-fade-in-scale animate-delay-600">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-white/20 to-white/30 hover:from-white/30 hover:to-white/40 border border-white/40 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-lg text-sm"
          >
            닫기
          </button>
        </div>
      </div>
    </BaseModal>
  );
} 