/**
 * Top Bar - Broadcast HUD Design
 * Sleek translucent glass HUD with neon accents and high-contrast information
 */

import React, { useMemo, useState } from 'react';

interface TopBarProps {
  playerLevel: number;
  playerName: string;
  softCurrency: number;
  premiumCurrency: number;
  playerAvatarUrl?: string;
  onProfileClick?: () => void;
  onInboxClick?: () => void;
  onSettingsClick?: () => void;
  onNotificationsClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  playerLevel,
  playerName,
  softCurrency,
  premiumCurrency,
  playerAvatarUrl,
  onProfileClick,
  onInboxClick,
  onSettingsClick,
  onNotificationsClick,
}) => {
  const [notificationCount] = useState(3);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const notificationItems = [
    'League finals registration closes in 2h',
    'Your rival challenged you to a sprint rematch',
    'Daily reward crate is ready to claim',
  ];

  const levelProgress = useMemo(() => {
    const remainder = playerLevel % 10;
    return remainder === 0 ? 100 : remainder * 10;
  }, [playerLevel]);

  return (
    <header className="top-hud h-24 bg-surface/80 backdrop-blur-3xl border-b border-white/5 px-10 flex items-center justify-between z-50 font-body">
      {/* Left Section: Command Logo & Operator Profile */}
      <div className="top-hud-left flex items-center gap-10">
        {/* Luminous Game Logo */}
        <div className="top-hud-logo flex items-center gap-3 group cursor-pointer transition-all duration-500 hover:scale-105 active:scale-95">
          <div className="relative">
             <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
             <span className="material-symbols-outlined text-primary text-4xl text-glow relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>
               waves
             </span>
          </div>
          <h1 className="font-headline font-black text-4xl tracking-tighter uppercase italic slanted text-glow text-on-surface">
             SWIM<span className="text-primary italic">26</span>
          </h1>
        </div>

        {/* Operator Profile - Command HUD Style */}
        <button
          onClick={onProfileClick}
          className="top-hud-profile flex items-center gap-5 p-2 pr-6 rounded-[32px] bg-white/[0.03] border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all duration-500 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
          
          {/* Avatar Ring */}
          <div className="relative z-10">
             <div className={`absolute -inset-1 rounded-2xl border-2 border-primary/40 group-hover:border-primary opacity-0 group-hover:opacity-100 transition-all duration-500 rotate-45 group-hover:rotate-0`} />
             {playerAvatarUrl ? (
               <img
                 src={playerAvatarUrl}
                 alt={playerName}
                 className="w-12 h-12 rounded-[20px] object-cover relative z-10 border border-white/10"
               />
             ) : (
               <div className="w-12 h-12 rounded-[20px] bg-surface border border-white/10 flex items-center justify-center text-primary font-headline text-xl font-black italic slanted relative z-10">
                 {playerName.charAt(0).toUpperCase()}
               </div>
             )}
          </div>

          <div className="text-left hidden lg:block relative z-10 transition-transform duration-500 group-hover:translate-x-1">
            <div className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mb-1">Combat Operator</div>
            <div className="font-headline text-2xl font-black italic slanted text-on-surface leading-none group-hover:text-glow transition-all">{playerName}</div>
          </div>
        </button>
      </div>

      {/* Center Section: Global Telemetry HUD */}
      <div className="top-hud-center flex items-center gap-6">
        {/* Tier / Rank Display */}
        <div className="top-hud-rank px-8 py-3 rounded-[28px] bg-white/[0.03] border border-white/10 relative overflow-hidden group hover:border-white/20 transition-all duration-500">
           <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="text-center relative z-10">
              <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.3em] mb-1 block">Global Vector</span>
              <span className="font-headline text-2xl font-black italic slanted text-primary text-glow">RANK #{((playerLevel * 42) % 1000).toString().padStart(3, '0')}</span>
           </div>
        </div>

        {/* Currency Array */}
        <div className="top-hud-currencies flex items-center gap-3">
           {/* Electric Gold Pod */}
           <div className="px-6 py-3 rounded-[28px] bg-secondary/5 border border-secondary/20 flex items-center gap-4 hover:border-secondary/50 hover:bg-secondary/10 transition-all duration-500 cursor-pointer shadow-[0_0_20px_rgba(255,215,9,0.05)]">
              <span className="material-symbols-outlined text-secondary text-2xl gold-glow" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
              <div>
                 <div className="text-[8px] font-black text-secondary/60 uppercase tracking-widest leading-none mb-1">Credits</div>
                 <div className="font-headline text-xl font-black italic slanted text-secondary gold-glow">{softCurrency.toLocaleString()}</div>
              </div>
           </div>

           {/* Pulse SP Pod */}
           <div className="px-6 py-3 rounded-[28px] bg-primary/5 border border-primary/20 flex items-center gap-4 hover:border-primary/50 hover:bg-primary/10 transition-all duration-500 cursor-pointer shadow-[0_0_20px_rgba(129,236,255,0.05)]">
              <span className="material-symbols-outlined text-primary text-2xl text-glow" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              <div>
                 <div className="text-[8px] font-black text-primary/60 uppercase tracking-widest leading-none mb-1">Pulse SP</div>
                 <div className="font-headline text-xl font-black italic slanted text-primary text-glow">{premiumCurrency}</div>
              </div>
           </div>
        </div>
      </div>

      {/* Right Section: Access Terminals */}
      <div className="top-hud-right flex items-center gap-4">
        {/* Utility Buttons */}
        <div className="flex items-center gap-2 p-1 rounded-full bg-white/[0.03] border border-white/5">
           {[
             { icon: 'notifications', count: notificationCount, onClick: () => { setIsNotificationsOpen(!isNotificationsOpen); onNotificationsClick?.(); }, color: 'text-error' },
             { icon: 'mail', onClick: onInboxClick },
             { icon: 'settings', onClick: onSettingsClick }
           ].map((btn, i) => (
             <button
               key={i}
               onClick={btn.onClick}
               className="h-12 w-12 rounded-full hover:bg-white/5 transition-all duration-300 relative group"
             >
                <span className={`material-symbols-outlined text-2xl text-on-surface-variant group-hover:text-primary transition-all ${btn.icon === 'settings' ? 'group-hover:rotate-90' : ''}`}>
                  {btn.icon}
                </span>
                {btn.count ? (
                  <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-error border-2 border-surface text-[8px] font-black text-white flex items-center justify-center animate-bounce">
                    {btn.count}
                  </span>
                ) : null}
             </button>
           ))}
        </div>

        {/* Terminal Connection Status */}
        <div className="pl-6 border-l border-white/10 flex flex-col items-end">
           <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(129,236,255,1)] animate-pulse" />
              <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] italic">Encrypted</span>
           </div>
           <span className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest opacity-40 mt-1">Uplink: Nominal</span>
        </div>

        {/* Notifications Dropdown */}
        {isNotificationsOpen && (
          <div className="absolute right-10 top-28 w-96 rounded-[40px] bg-surface/95 backdrop-blur-3xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] p-8 z-[60] animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between mb-8">
               <h4 className="font-headline text-xl font-black italic slanted uppercase text-primary text-glow">Uplink Data</h4>
               <button onClick={() => setIsNotificationsOpen(false)} className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest hover:text-on-surface transition-colors">Clear Stream</button>
            </div>
            <div className="space-y-3">
              {notificationItems.map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/20 hover:bg-primary/[0.02] transition-all cursor-pointer group">
                   <div className="text-[11px] text-on-surface opacity-80 group-hover:opacity-100 transition-opacity">{item}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
