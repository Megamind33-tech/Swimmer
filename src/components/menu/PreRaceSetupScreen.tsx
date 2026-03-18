/**
 * Pre-Race Setup Screen - Race configuration
 * Swimmer selection, event setup, opponents, rewards, confirmation
 */

import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

interface PreRaceSetupScreenProps {
  mode?: string;
  onConfirmRace?: () => void;
  onCancel?: () => void;
  /** Called whenever the user changes distance/stroke/venue so parent can track config */
  onConfigChange?: (partial: { distance?: string; stroke?: string; venue?: string }) => void;
}

export const PreRaceSetupScreen: React.FC<PreRaceSetupScreenProps> = ({
  mode = 'Quick Race',
  onConfirmRace,
  onCancel,
  onConfigChange,
}) => {
  const [selectedDistance, setSelectedDistance] = useState('100M');
  const [selectedStroke, setSelectedStroke] = useState('FREESTYLE');
  const [selectedVenue, setSelectedVenue] = useState('olympic');
  const [isStarting, setIsStarting] = useState(false);

  const distances = ['50M', '100M', '200M', '400M', '800M', '1500M'];
  const strokes = ['FREESTYLE', 'BUTTERFLY', 'BREASTSTROKE', 'BACKSTROKE', 'IM'];
  const venues = [
    { id: 'olympic', name: 'Olympic Arena', weather: 'Clear' },
    { id: 'training', name: 'Training Facility', weather: 'Indoor' },
    { id: 'championship', name: 'Championship Pool', weather: 'Clear' },
    { id: 'neon', name: 'Neon District', weather: 'Night' },
  ];

  const opponents = [
    { name: 'Kaito M.', rank: '#45', specialty: 'Freestyler' },
    { name: 'Luna S.', rank: '#123', specialty: 'Distance' },
    { name: 'Alex J.', rank: '#89', specialty: 'Technician' },
    { name: 'Mira P.', rank: '#234', specialty: 'Sprinter' },
  ];

  return (
    <div className="hydro-page-shell flex-1 relative w-full h-full overflow-y-auto flex flex-col font-body">
      {/* Cinematic Header */}
      <div className="p-12 max-[900px]:p-8 bg-gradient-to-b from-primary/15 to-transparent border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[160px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between gap-8 flex-wrap">
          <div>
            {/* Back button */}
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex items-center gap-1.5 mb-4 text-white/55 hover:text-white/85 transition-colors active:scale-95"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <ChevronLeft size={14} />
                <span className="text-[10px] font-black uppercase tracking-[0.25em]">Back to Modes</span>
              </button>
            )}
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-12 bg-primary/40" />
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm animate-pulse">radar</span>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Pre-Flight Biometric Check In-Progress</span>
              </div>
            </div>
            
            <h1 className="font-headline text-5xl max-[900px]:text-3xl font-black italic slanted uppercase text-on-surface text-glow">
              {mode} Terminal
            </h1>
          </div>
          
          <div className="flex items-center gap-8 p-6 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-3xl">
             <div className="text-center group cursor-pointer">
               <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block group-hover:text-primary transition-colors">Sector</span>
               <span className="font-headline text-2xl font-black italic slanted text-primary text-glow">Circuit A-1</span>
             </div>
             <div className="h-10 w-[1px] bg-white/10" />
             <div className="text-center group cursor-pointer">
                <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1 block group-hover:text-secondary transition-colors">Stability</span>
                <span className="font-headline text-2xl font-black italic slanted text-secondary gold-glow text-glow">Nominal</span>
             </div>
          </div>
        </div>
      </div>

      <div className="hydro-page-content p-10 max-w-7xl mx-auto w-full space-y-10 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Configuration (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Distance Grid */}
            <div className="p-1 rounded-[40px] bg-gradient-to-br from-white/10 to-transparent">
              <div className="p-8 rounded-[36px] bg-surface">
                 <div className="flex items-center gap-3 mb-6">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Parameter 01</span>
                    <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Engagement Range</h3>
                 </div>
                 <div className="grid grid-cols-3 gap-3">
                   {distances.map((dist) => (
                     <button
                       key={dist}
                       onClick={() => { setSelectedDistance(dist); onConfigChange?.({ distance: dist }); }}
                       className={`h-16 rounded-2xl font-headline font-black italic slanted uppercase text-[13px] tracking-widest transition-all duration-500 border overflow-hidden relative group ${
                         selectedDistance === dist
                           ? 'bg-primary/20 border-primary/40 text-primary text-glow'
                           : 'bg-white/5 border-white/5 text-on-surface-variant hover:border-white/20'
                       }`}
                     >
                       {dist}
                       <div className={`absolute inset-x-0 bottom-0 h-[2px] bg-primary transition-transform duration-500 origin-left ${selectedDistance === dist ? 'scale-x-100' : 'scale-x-0'}`} />
                     </button>
                   ))}
                 </div>
              </div>
            </div>

            {/* Stroke Grid */}
            <div className="p-1 rounded-[40px] bg-gradient-to-br from-white/10 to-transparent">
              <div className="p-8 rounded-[36px] bg-surface">
                 <div className="flex items-center gap-3 mb-6">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Parameter 02</span>
                    <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Kinetic Pattern</h3>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                   {strokes.map((stroke) => (
                     <button
                       key={stroke}
                       onClick={() => { setSelectedStroke(stroke); onConfigChange?.({ stroke }); }}
                       className={`h-16 rounded-2xl font-headline font-black italic slanted uppercase text-[11px] tracking-widest transition-all duration-500 border overflow-hidden relative group ${
                         selectedStroke === stroke
                           ? 'bg-primary/20 border-primary/40 text-primary text-glow'
                           : 'bg-white/5 border-white/5 text-on-surface-variant hover:border-white/20'
                       }`}
                     >
                       {stroke}
                       <div className={`absolute inset-x-0 bottom-0 h-[2px] bg-primary transition-transform duration-500 origin-left ${selectedStroke === stroke ? 'scale-x-100' : 'scale-x-0'}`} />
                     </button>
                   ))}
                 </div>
              </div>
            </div>

            {/* Venue Selection */}
            <div className="p-1 rounded-[40px] bg-gradient-to-br from-white/10 to-transparent">
              <div className="p-8 rounded-[36px] bg-surface">
                 <div className="flex items-center gap-3 mb-6">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Parameter 03</span>
                    <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface text-glow">Vector Coordinates</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   {venues.map((venue) => (
                     <button
                       key={venue.id}
                       onClick={() => { setSelectedVenue(venue.id); onConfigChange?.({ venue: venue.id }); }}
                       className={`group/venue p-6 rounded-3xl border transition-all duration-500 text-left relative overflow-hidden ${
                         selectedVenue === venue.id
                           ? 'bg-primary/20 border-primary/40 shadow-[0_0_20px_rgba(129,236,255,0.1)]'
                           : 'bg-white/[0.03] border-white/5 hover:bg-white/10 hover:border-white/20'
                       }`}
                     >
                       {selectedVenue === venue.id && <div className="absolute inset-x-0 bottom-0 h-[2px] bg-primary shadow-[0_0_10px_rgba(129,236,255,1)]" />}
                       <div className={`text-[9px] font-black uppercase tracking-widest mb-1 ${selectedVenue === venue.id ? 'text-primary' : 'text-on-surface-variant opacity-40'}`}>
                          0{venues.indexOf(venue) + 1} / Location
                       </div>
                       <div className="font-headline text-xl font-black italic slanted uppercase text-on-surface group-hover/venue:text-glow transition-all">{venue.name}</div>
                       <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 mt-1">Met: {venue.weather}</div>
                     </button>
                   ))}
                 </div>
              </div>
            </div>
          </div>

          {/* Right Column: Telemetry & Opponent (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Swimmer Telemetry */}
            <div className="group/telemetry relative p-1 rounded-[40px] bg-gradient-to-br from-primary/40 via-white/5 to-transparent">
               <div className="p-10 rounded-[36px] bg-surface relative overflow-hidden">
                  <div className="absolute -right-20 -top-20 h-48 w-48 bg-primary/10 blur-3xl" />
                  
                  <div className="flex items-center gap-6 mb-10 relative z-10">
                     <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse" />
                        <div className="h-20 w-20 rounded-[28px] bg-primary/20 border border-primary/40 flex items-center justify-center relative z-10">
                           <span className="material-symbols-outlined text-4xl text-primary text-glow">biometrics</span>
                        </div>
                     </div>
                     <div>
                        <div className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mb-1">Elite Operator</div>
                        <h4 className="font-headline text-3xl font-black italic slanted uppercase text-on-surface text-glow">M. Phiri</h4>
                     </div>
                  </div>

                  <div className="space-y-6 relative z-10">
                    {[
                      { label: 'Kinetic Drive', val: 18, max: 20 },
                      { label: 'Fluid Efficiency', val: 17, max: 20 },
                      { label: 'Power Matrix', val: 19, max: 20 }
                    ].map((stat, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-end">
                           <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-60">{stat.label}</span>
                           <span className="font-headline text-lg font-black italic slanted text-primary text-glow">{stat.val} / {stat.max}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                           <div 
                             className="h-full bg-primary shadow-[0_0_10px_rgba(129,236,255,1)] transition-all duration-1000" 
                             style={{ width: `${(stat.val / stat.max) * 100}%` }} 
                           />
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Target Acquisition (Opponents) */}
            <div className="p-1 rounded-[40px] bg-white/10">
               <div className="p-10 rounded-[36px] bg-surface relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-[10px] font-black text-secondary uppercase tracking-[0.4em]">Scan Level 4</span>
                    <h3 className="font-headline text-2xl font-black italic slanted uppercase text-on-surface gold-glow group-hover:text-glow transition-all">Opponent Data</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {opponents.map((opp, idx) => (
                      <div key={idx} className="group/opp p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center font-headline text-secondary font-black italic slanted">
                               {opp.name.charAt(0)}
                            </div>
                            <div>
                               <div className="font-headline text-base font-black italic slanted uppercase text-on-surface group-hover/opp:text-glow transition-all">{opp.name}</div>
                               <div className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest opacity-40">{opp.specialty}</div>
                            </div>
                         </div>
                         <div className="font-headline text-lg font-black italic slanted text-secondary gold-glow opacity-80 group-hover/opp:opacity-100 transition-opacity">
                            {opp.rank}
                         </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Reward Forecast */}
            <div className="p-10 rounded-[40px] bg-gradient-to-r from-secondary/20 to-transparent border border-secondary/10">
               <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-secondary uppercase tracking-[0.4em] mb-1 block italic">Reward Forecast</span>
                    <div className="font-headline text-3xl font-black italic slanted text-secondary gold-glow">800 XP + 2.5K CR</div>
                  </div>
                  <span className="material-symbols-outlined text-4xl text-secondary animate-bounce">monetization_on</span>
               </div>
            </div>
          </div>
        </div>

        {/* Global Action Terminal */}
        <div className="fixed bottom-0 left-0 right-0 p-8 bg-surface/80 backdrop-blur-3xl border-t border-white/5 z-50">
           <div className="max-w-7xl mx-auto flex gap-6">
              <button
                onClick={onCancel}
                disabled={isStarting}
                className="flex-[1] h-20 rounded-[28px] border-2 border-white/10 hover:border-white/40 font-headline text-2xl font-black italic slanted uppercase text-on-surface-variant hover:text-on-surface transition-all duration-500 flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-3xl">close</span>
                Abort
              </button>
              
              <button
                onClick={() => {
                   setIsStarting(true);
                   setTimeout(() => onConfirmRace?.(), 300);
                }}
                disabled={isStarting}
                className="flex-[3] relative h-20 rounded-[28px] bg-primary border-2 border-white/20 shadow-[0_0_40px_rgba(129,236,255,0.3)] hover:shadow-[0_0_60px_rgba(129,236,255,0.5)] active:scale-[0.98] transition-all duration-500 font-headline text-3xl font-black italic slanted uppercase text-surface flex items-center justify-center gap-6 group overflow-hidden disabled:opacity-50"
              >
                 <div className="absolute inset-x-0 bottom-0 h-2 bg-white/40 shadow-[0_0_20px_rgba(255,255,255,1)]" />
                 
                 {isStarting ? (
                   <div className="flex items-center gap-6 animate-pulse">
                      <span>Synchronizing...</span>
                      <div className="h-8 w-8 rounded-full border-4 border-surface/30 border-t-surface animate-spin" />
                   </div>
                 ) : (
                   <div className="flex items-center gap-6 group-hover:tracking-widest transition-all duration-700">
                      <span>Initiate Kinetic Run</span>
                      <span className="material-symbols-outlined text-4xl group-hover:translate-x-3 transition-transform duration-700">rocket_launch</span>
                   </div>
                 )}
                 
                 {/* Laser Scan Effect */}
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PreRaceSetupScreen;
