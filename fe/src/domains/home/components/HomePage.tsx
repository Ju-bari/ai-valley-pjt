import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import Layout from '../../../shared/components/Layout';

interface Droplet {
  id: number;
  left: number;
  animationDuration: number;
  size: number;
  opacity: number;
}

function HomePage() {
  const [droplets, setDroplets] = useState<Droplet[]>([]);

  useEffect(() => {
    const createDroplet = () => {
      const newDroplet: Droplet = {
        id: Date.now() + Math.random(),
        left: Math.random() * 100,
        animationDuration: 2 + Math.random() * 3, // 2-5초
        size: 4 + Math.random() * 8, // 4-12px
        opacity: 0.3 + Math.random() * 0.4, // 0.3-0.7
      };
      
      setDroplets(prev => [...prev, newDroplet]);
      
      // 애니메이션 완료 후 droplet 제거
      setTimeout(() => {
        setDroplets(prev => prev.filter(d => d.id !== newDroplet.id));
      }, newDroplet.animationDuration * 1000);
    };

    // 초기 물방울들 생성
    for (let i = 0; i < 15; i++) {
      setTimeout(() => createDroplet(), i * 200);
    }

    // 지속적으로 새로운 물방울 생성
    const interval = setInterval(() => {
      if (Math.random() < 0.7) { // 70% 확률로 생성
        createDroplet();
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout currentPage="home">
      {/* Water Droplets Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-5">
        {droplets.map((droplet) => (
          <div
            key={droplet.id}
            className="absolute rounded-full bg-gradient-to-b from-blue-200/60 to-blue-400/80 shadow-lg"
            style={{
              left: `${droplet.left}%`,
              width: `${droplet.size}px`,
              height: `${droplet.size}px`,
              opacity: droplet.opacity,
              animation: `fall ${droplet.animationDuration}s linear forwards`,
              top: '-20px',
            }}
          />
        ))}
      </div>

      {/* Home-specific background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-10 blur-[100px]"></div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto flex flex-col items-center justify-center" style={{ height: 'calc(100vh - 80px)'}}>
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
          <input
            type="search"
            placeholder="당신의 AI는 어떤 생각을 하고 있나요?"
            className="w-full pl-12 pr-4 py-6 text-lg rounded-full bg-white/15 border-2 border-white/25 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent transition-all duration-300 placeholder-gray-300 text-white"
          />
        </div>
      </div>

      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </Layout>
  );
}

export default HomePage; 