/**
 * GameButton — FC26 Broadcast Standard button component
 *
 * Replaces all standard HTML <button> elements in game menus.
 * Provides tactile active:scale feedback, thumb-friendly min-height,
 * and three variants matching the broadcast design system.
 *
 * Variants:
 *   primary  — volt yellow fill, carbon text (main CTAs: RACE NOW, CONFIRM)
 *   secondary — dark panel + volt border, volt text (supporting actions)
 *   ghost    — transparent + subtle border, muted text (tertiary actions)
 *   danger   — broadcast red fill (destructive actions only)
 */

import React from 'react';

interface GameButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const BASE =
  'relative inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wide ' +
  'transition-transform duration-100 active:scale-[0.95] ' +
  'select-none touch-manipulation cursor-pointer ' +
  'disabled:opacity-40 disabled:pointer-events-none overflow-hidden';

const SIZES: Record<string, string> = {
  sm: 'min-h-[36px] px-3 text-[11px] tracking-[0.12em]',
  md: 'min-h-[44px] px-4 text-[13px] tracking-[0.10em]',
  lg: 'min-h-[52px] px-6 text-[15px] tracking-[0.10em]',
};

const VARIANTS: Record<string, string> = {
  primary:
    'bg-[#CCFF00] text-[#0A0A0A] border border-transparent ' +
    "font-[900] italic [font-family:'Barlow_Condensed',sans-serif]",
  secondary:
    'bg-[#0C1B2D] text-[#CCFF00] border border-[rgba(200,255,0,0.35)] ' +
    "font-[700] [font-family:'Barlow_Condensed',sans-serif]",
  ghost:
    'bg-transparent text-[#9EB2C7] border border-[rgba(255,255,255,0.12)] ' +
    "font-[700] [font-family:'Barlow_Condensed',sans-serif]",
  danger:
    'bg-[#FF003C] text-white border border-transparent ' +
    "font-[700] [font-family:'Barlow_Condensed',sans-serif]",
};

export const GameButton: React.FC<GameButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false,
  icon,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        BASE,
        SIZES[size],
        VARIANTS[variant],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Scan-line texture overlay for game-feel depth */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(180deg,transparent 0,transparent 1px,rgba(0,0,0,0.06) 1px,rgba(0,0,0,0.06) 2px)',
          backgroundSize: '100% 2px',
        }}
      />
      {icon && <span className="relative z-10 shrink-0">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default GameButton;
