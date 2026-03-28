import React, { useEffect } from 'react';
import { Waves } from 'lucide-react';

export const BootScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#020b14] flex flex-col items-center justify-center z-[500] pointer-events-none overflow-hidden">
      <div className="absolute inset-0 water-caustics opacity-50"></div>
      <div className="animate-boot flex flex-col items-center relative z-10">
        <Waves size={56} className="text-[#18C8F0] mb-4 opacity-90 drop-shadow-[0_0_15px_rgba(24,200,240,0.5)]" />
        <h1 className="font-bebas text-6xl tracking-[0.2em] text-[#F3F7FC] drop-shadow-lg">TITAN<span className="text-[#18C8F0]">SPORTS</span></h1>
        <p className="font-rajdhani text-xs uppercase tracking-[0.3em] text-[#18C8F0] mt-3 font-bold opacity-80">Connecting to EA Servers...</p>
      </div>
    </div>
  );
};

export default BootScreen;
