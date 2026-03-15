import React from 'react';
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
  return (
    <div className={`pointer-events-none ${className}`}>
      <div className="relative h-full min-h-[24rem]">
        <img
          src={miaPhiriAthleteImage}
          alt="Mia Phiri model"
          className="absolute inset-0 h-full w-full object-contain object-bottom drop-shadow-[0_25px_45px_rgba(0,0,0,0.82)]"
          style={{ maskImage: 'linear-gradient(to bottom, black 62%, transparent 100%)' }}
        />

        {swim26Costume && (
          <>
            {/* Swim26 costume overlay: only torso area, preserves headwear/face area */}
            <div className="absolute left-[36%] top-[48%] h-[38%] w-[31%] rounded-[18%] bg-[#04172b]/72" />
            <div className="absolute left-[49.6%] top-[49%] h-[36%] w-[2.2%] bg-white/92" />
            <div className="absolute left-[52.2%] top-[49%] h-[36%] w-[1.4%] bg-[#c7102e]/92" />
            <div className="absolute left-[43%] top-[61%] rounded-full border border-primary-fixed/70 bg-[#0f62fe]/35 px-2 py-1 text-[10px] font-black tracking-wider text-white">
              SWIM26
            </div>
          </>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-3 text-left">
          <p className="text-xs font-black uppercase tracking-wider text-primary-fixed">{title}</p>
          <p className="text-sm font-semibold text-white">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default ModelShowcaseCard;
