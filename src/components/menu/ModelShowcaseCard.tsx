import React, { useState, useEffect, useRef } from 'react';
import miaPhiriAthleteImage from '../../designs/835_mia_phiri_news.png_1/screen.png';

interface ModelShowcaseCardProps {
  title?: string;
  subtitle?: string;
  className?: string;
  swim26Costume?: boolean;
}

export const ModelShowcaseCard: React.FC<ModelShowcaseCardProps> = ({
  title = 'Featured Model',
  subtitle = 'Mia Phiri',
  className = '',
  swim26Costume = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gyroRotation, setGyroRotation] = useState({ x: 0, y: 0 });
  const [magneticTilt, setMagneticTilt] = useState({ x: 0, y: 0 });
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  // Gyroscope response
  useEffect(() => {
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta && event.gamma) {
        // Subtle rotation based on device tilt (max ±5 degrees)
        const tiltX = Math.min(Math.max(event.beta / 20, -5), 5);
        const tiltY = Math.min(Math.max(event.gamma / 20, -5), 5);
        setGyroRotation({ x: tiltX, y: tiltY });

        // Parallax offset (reverse direction for depth effect)
        setParallaxOffset({
          x: (event.gamma / 90) * 20,
          y: (event.beta / 180) * 20,
        });
      }
    };

    window.addEventListener('deviceorientation', handleDeviceOrientation);
    return () => window.removeEventListener('deviceorientation', handleDeviceOrientation);
  }, []);

  // Magnetic effect - subtle tilt toward touch/cursor
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate tilt toward cursor (max ±3 degrees)
    const tiltX = ((mouseY - centerY) / centerY) * 3;
    const tiltY = ((mouseX - centerX) / centerX) * -3;

    setMagneticTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setMagneticTilt({ x: 0, y: 0 });
  };

  // Combined rotation
  const totalRotationX = gyroRotation.x + magneticTilt.x;
  const totalRotationY = gyroRotation.y + magneticTilt.y;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative pointer-events-auto ${className}`}
      style={{
        perspective: '1000px',
      }}
    >
      {/* Outer glass container with parallax layers */}
      <div
        className="relative h-full min-h-[24rem] rounded-2xl glass-card-elevated overflow-hidden"
        style={{
          transform: `perspective(1200px) rotateX(${totalRotationX}deg) rotateY(${totalRotationY}deg) translateZ(20px)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.2s ease-out',
        }}
      >
        {/* Background layer - moves slower for parallax effect */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-neon-cyan/10 via-transparent to-pool-dark/40"
          style={{
            transform: `translateX(${parallaxOffset.x * 0.5}px) translateY(${parallaxOffset.y * 0.5}px) translateZ(-50px)`,
          }}
        ></div>

        {/* Model image layer - moves faster */}
        <img
          src={miaPhiriAthleteImage}
          alt="Mia Phiri model"
          className="absolute inset-0 h-full w-full object-contain object-bottom drop-shadow-[0_25px_45px_rgba(0,255,255,0.4)]"
          style={{
            maskImage: 'linear-gradient(to bottom, black 62%, transparent 100%)',
            transform: `translateX(${parallaxOffset.x}px) translateY(${parallaxOffset.y}px) translateZ(20px)`,
          }}
        />

        {/* Swim26 costume overlay with neon glow */}
        {swim26Costume && (
          <>
            {/* Swim26 costume overlay: only torso area, preserves headwear/face area */}
            <div className="absolute left-[36%] top-[48%] h-[38%] w-[31%] rounded-[18%] bg-[#04172b]/72 shadow-[inset_0_0_20px_rgba(0,255,255,0.2)]" />
            <div className="absolute left-[49.6%] top-[49%] h-[36%] w-[2.2%] bg-white/92 shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
            <div className="absolute left-[52.2%] top-[49%] h-[36%] w-[1.4%] bg-[#c7102e]/92 shadow-[0_0_8px_rgba(199,16,46,0.6)]" />
            <div className="absolute left-[43%] top-[61%] rounded-full border-2 border-neon-cyan bg-gradient-to-br from-neon-cyan/20 to-neon-cyan/5 px-2 py-1 text-[10px] font-black tracking-wider text-neon-cyan shadow-[0_0_12px_rgba(0,255,255,0.5)]">
              SWIM26
            </div>
          </>
        )}

        {/* Label overlay with glassmorphic effect */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-broadcast-overlay via-broadcast-overlay/50 to-transparent backdrop-blur-md p-4 text-left border-t border-neon-cyan/20">
          <p className="text-xs font-black uppercase tracking-wider text-neon-cyan drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]">
            {title}
          </p>
          <p className="text-sm font-bold font-chakra text-white mt-1">
            {subtitle}
          </p>
        </div>

        {/* Splash effect placeholder for BabylonJS integration */}
        <div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 w-40 h-20 animate-parallax-float"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,255,0.1) 0%, transparent 70%)',
            filter: 'blur(20px)',
            animation: 'parallaxFloat 4s ease-in-out infinite',
          }}
        ></div>
      </div>

      {/* Outer glow effect */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none shadow-[0_0_30px_rgba(0,255,255,0.2),inset_0_0_20px_rgba(0,255,255,0.1)]"
        style={{
          opacity: Math.abs(totalRotationX) + Math.abs(totalRotationY) > 0 ? 0.8 : 0.5,
        }}
      ></div>
    </div>
  );
};

export default ModelShowcaseCard;
