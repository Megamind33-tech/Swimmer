/**
 * SWIM 26 - Professional Loading Screen
 * Asset loading with Mia Phiri featured athlete showcase
 * Similar to FC25/FC26 real-time blend loading
 */

import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  isLoading: boolean;
  progress: number; // 0-100
  onComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoading,
  progress,
  onComplete
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [phase, setPhase] = useState<'assets' | 'models' | 'complete'>('assets');

  useEffect(() => {
    if (progress >= 100) {
      setPhase('complete');
      setTimeout(() => {
        onComplete?.();
      }, 1000);
    } else if (progress < 33) {
      setPhase('assets');
    } else if (progress < 66) {
      setPhase('models');
    }
  }, [progress, onComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayProgress(prev => Math.min(prev + Math.random() * 5, progress));
    }, 100);
    return () => clearInterval(interval);
  }, [progress]);

  if (!isLoading && phase === 'complete') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden z-[9998]">
      {/* Main Loading Container */}
      <div className="relative w-full h-full flex items-center justify-center">

        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black"></div>

        {/* Mia Phiri Featured Image - Full Screen Swimming Action - Like FIFA Cover */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%231e90ff;stop-opacity:0.9" /><stop offset="50%" style="stop-color:%2300bfff;stop-opacity:0.9" /><stop offset="100%" style="stop-color:%2300ced1;stop-opacity:0.9" /></linearGradient></defs><rect width="1920" height="1080" fill="url(%23grad)"/><g opacity="0.3" transform="translate(1200, 300)"><circle cx="0" cy="0" r="300" fill="white"/></g></svg>')`,
            opacity: 0.6
          }}
        >
          {/* Swimming action graphic - Ready for real image */}
          <div className="absolute inset-0 flex items-center justify-end pr-48">
            <div className="text-right">
              <p className="text-white/50 text-sm">Swimming Champion</p>
            </div>
          </div>
        </div>

        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/70"></div>

        {/* Content Container - Lower Right Position */}
        <div className="relative z-10 text-right max-w-lg mr-12 mb-20">

          {/* Loading Status - With Athlete Name During Assets Phase */}
          <div className="mb-12">
            {phase === 'assets' && (
              <div className="animate-fade-in">
                <h3 className="text-sm md:text-base text-slate-400 uppercase tracking-widest mb-2">
                  Featured Champion
                </h3>
                <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-1">
                  MIA PHIRI
                </h2>
                <p className="text-slate-300 text-lg mb-6">
                  Loading Assets & Textures
                </p>
              </div>
            )}
            {phase === 'models' && (
              <p className="text-slate-300 text-lg mb-6 animate-pulse">
                Initializing 3D Models & Physics
              </p>
            )}
            {phase === 'complete' && (
              <p className="text-green-400 text-lg mb-6 font-semibold">
                Ready to Compete
              </p>
            )}

            {/* Progress Bar Container */}
            <div className="relative h-3 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-slate-700/50 w-full">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>

              {/* Progress Fill */}
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                style={{ width: `${displayProgress}%` }}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
              </div>
            </div>

            {/* Percentage Display */}
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-400">
                {phase === 'assets' ? '📦' : phase === 'models' ? '🎮' : '✓'}
                {' '}
                {['Assets', 'Models', 'Ready'][phase === 'assets' ? 0 : phase === 'models' ? 1 : 2]}
              </span>
              <span className="font-mono text-cyan-400 font-semibold">
                {Math.round(displayProgress)}%
              </span>
            </div>
          </div>

          {/* Stats Display - Right Aligned */}
          <div className="space-y-3 text-right">
            <div className="inline-block p-3 bg-slate-800/30 rounded-lg backdrop-blur-sm border border-slate-700/30">
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Peak Performance</p>
              <p className="text-cyan-400 font-bold text-lg">2.48 m/s</p>
            </div>
          </div>

          {/* Footer Text */}
          <div className="mt-12 text-slate-500 text-xs text-right">
            <p>Powered by Babylon.js 3D Engine</p>
            <p className="mt-1">© 2026 Mosty Games</p>
          </div>
        </div>

        {/* SWIM 26 Logo - Top Left */}
        <div className="absolute top-8 left-8 z-20">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            SWIM <span className="text-cyan-400">26</span>
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Championship Edition</p>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.5;
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
          }
          50% {
            opacity: 1;
            box-shadow: 0 0 40px rgba(34, 197, 94, 0.8);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
