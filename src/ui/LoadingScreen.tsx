import React, { useState, useEffect } from 'react';

export const LoadingScreen = ({ onComplete, setAssets }: { onComplete: () => void, setAssets: (assets: any) => void }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("WARMING UP");
  const [canStart, setCanStart] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const loadAssets = async () => {
      setStatus("PREPARING POOL DECK");
      setProgress(25);
      const staticArenaBg = "https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&w=1200&q=80";
      
      await new Promise(resolve => setTimeout(resolve, 500));
      if(!mounted) return;
      setProgress(60);
      setStatus("FETCHING START LISTS");
      const staticAvatarImg = "https://images.unsplash.com/photo-1512412086892-424a29ef90c5?auto=format&fit=crop&w=200&q=80";

      await new Promise(resolve => setTimeout(resolve, 500));
      if(!mounted) return;
      setProgress(95);
      setStatus("FINALIZING ATHLETE DATA");
      
      setTimeout(() => {
        if(!mounted) return;
        setAssets({ arenaBg: staticArenaBg, avatarImg: staticAvatarImg });
        setProgress(100);
        setStatus("READY TO COMPETE");
        setCanStart(true);
      }, 400);
    };

    loadAssets();
    return () => { mounted = false; };
  }, [setAssets]);

  return (
    <div className="fixed inset-0 bg-[#020b14] z-[400] flex flex-col justify-end p-6 md:p-12 pointer-events-auto">
      <div className="absolute inset-0 water-caustics opacity-60 pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-[500px] mx-auto md:mx-0">
        <h1 className="font-bebas text-5xl md:text-7xl tracking-wider text-[#F3F7FC] mb-2 leading-none drop-shadow-lg">
          SWIM<span className="text-[#18C8F0]">26</span>
        </h1>
        
        <div className="flex justify-between items-end mb-2">
          <span className="font-rajdhani text-xs md:text-sm font-bold text-[#18C8F0] tracking-widest uppercase">{status}</span>
          <span className="font-rajdhani text-sm md:text-base font-bold text-[#F3F7FC]">{progress}%</span>
        </div>
        
        <div className="h-2 w-full bg-[#112240] relative overflow-hidden rounded-sm">
          <div 
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#18C8F0] to-[#C8FF00] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {canStart && (
          <button 
            onClick={onComplete}
            className="mt-8 w-full h-[54px] bg-[#F3F7FC] text-[#0a192f] btn-primary-clip font-bebas text-2xl tracking-[0.1em] btn-mech shadow-[0_4px_20px_rgba(243,247,252,0.3)] animate-slide"
          >
            ENTER ARENA
          </button>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
